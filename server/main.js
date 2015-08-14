// Meteor.startup(function () {
//
//     // Games.remove({});
//     Games.insert({createdBy_id:   'QTRXP7YEfbq8HSdkS',
//                   createdBy_name: 'Hana',
//                   opponent_id:    '6E9qTZxXzXiWJwC72',
//                   opponent_name:  'Ellie',
//                   status:         'proposed',
//                   createdAt:      new Date(),
//                   });
//
//     Games.insert({createdBy_id:   'fakefakefakefake2',
//                   createdBy_name: 'Bixx',
//                   opponent_id:    'fakefakefakefake1',
//                   opponent_name:  'Frank',
//                   status:         'proposed',
//                   createdAt:      new Date(),
//                   });
// });

Meteor.methods({

  knock: function(_id){
    console.log("knock");

    var cards = Cards.find({hand: this.userId}, {sort: {position: 1}}).fetch();
    var discards = Cards.find({hand: 'discard'}, {sort: {position: 1}}).fetch();   //needs GameId
    var hv = handVal([], cards);
    if( (hv.points - hv.cards[hv.cards.length-1].val ) > 10){
      throw new Meteor.Error(403, "Cannot Knock: " + hv.points + " - " + hv.cards[hv.cards.length-1].val  + " = " + (hv.points - hv.cards[hv.cards.length-1].val ) );
    }
    if(hv.cards.length > 0){
      Cards.update(hv.cards[hv.cards.length-1]._id, { $set: { hand: 'discard', position: discards.length } });
    }

    //Calculate score, update result

    /*{ createdBy_points: 10,
    createdBy_bonus: 25,
    opponent_points: 0,
    opponent_bonus: 0,
    result: 'Gin' }*/

    if(hv.points === 0){
      Games.update(_id, { $set:{
                    knocked: this.userId,
                    status: 'scoreboard' }});
    } else {
      Games.update(_id, { $set:{
                    knocked: this.userId,
                    status: 'knocked' }});
    }
    Cards.update({gameId: _id}, {$set: {showOpponent: true}}, {multi: true});
  },

  sort_stop: function(card_id, newPosition){
    Cards.update({_id: card_id}, {$set: {position: newPosition}});
  },


  startGame: function(_id){
    // Shuffle cards, 10 to each player, one to discard pile, rest to deck  - all arrays in game object
    // Mark one player as current turn.

    game = Games.findOne(_id);
    var deck = [];
    ['hearts', 'diams', 'clubs', 'spades'].map( function(s){
      ['a', '2', '3', '4','5', '6', '7', '8', '9', '10', 'j', 'q', 'k'].map( function(r) {
        deck.push({suit : s, rank: r});
      });
    });

    var val = function(i){
      n = parseInt(i);
      if (isNaN(n)){
        if(i === 'a'){
          return 1;
        }
        if(i === 'j'){
          return 11;
        }
        if(i === 'q'){
          return 12;
        }
        if(i === 'k'){
          return 13;
        }
      }
      return n;
    };

    deck.map(function(i){i.val = val(i.rank);});
    deck = _.shuffle(deck);
    deck = _.shuffle(deck);

    var hands = [[], []];
    for(var j=0; j<2; j++){
      for (var i=0; i<10; i++){
        hands[j].push(deck.pop());
      }
      hands[j].sort(sorter);
    }

    takeCard = function(hand, deck){
      var card = deck.pop();
      Cards.insert({gameId: _id,
                    hand: hand,
                    position: i,    // i is coming from outside this scope, probably should fix.
                    suit: card.suit,
                    rank: card.rank,
                    val: val(card.rank),
                    showOpponent: false,
                    });
    };

    for (var i=0; i<10; i++){      // ugly...
      takeCard(game.createdBy_id, hands[0]);
      takeCard(game.opponent_id, hands[1]);
    }

    i=0;
    takeCard('discard', deck);

    for (i=0; i<31; i++){
      takeCard('deck', deck);
    }

    Games.update(_id, { $set:{
                  status: 'accepted',
                  result: [] }});
    return _id;
  },

  pickupDiscard: function(newPosition){
    // Check it's appropriate at this point
    card_id = Cards.findOne({hand: 'discard'}, {sort: {position: -1}, limit: 1})._id;
    //newPosition = Cards.findOne({hand: this.userId}, {sort: {position: -1}, limit: 1}).position + 1;
    Cards.update(card_id, { $set: { hand: this.userId, position: newPosition } } );
  },

  pickupNewCard: function(newPosition){
    // TODO: Check it's appropriate at this point
    console.log('pos: ' + Cards.findOne({hand: 'deck'}, {sort: {position: -1}, limit: 1}).position);

    card_id = Cards.findOne({hand: 'deck'}, {sort: {position: -1}, limit: 1})._id;
    // newPosition = Cards.findOne({hand: this.userId}, {sort: {position: -1}, limit: 1}).position + 1;
    Cards.update(card_id, { $set: { hand: this.userId, position: newPosition } } );
    // TODO: Needs to return values to client, indicate number of cards left, or fail/not allowed

  },

  discard: function(_id){
    // Check it's appropriate at this point
    var cards = Cards.find({hand: this.userId}).fetch();
    if(true || cards.length === 11){
      var discards = Cards.find({hand: 'discard'}).fetch();
      Cards.update(_id, { $set: { hand: 'discard', position: discards.length } });

      console.log("_id", _id);
      var c = Cards.findOne(_id);
      var game = Games.findOne(c.gameId);
      // Rotate turn
      if (game.turn === game.createdBy_id ){
        Games.update(game._id, { $set: {turn: game.opponent_id }});
      } else {
        Games.update(game._id, { $set: {turn: game.createdBy_id }});
      }
    }else{ throw new Meteor.Error(403, 'Cannot discard');
    }
  },

  layoff: function(_id){
    var card = Cards.findOne(_id);
    var game = Games.findOne(card.gameId);
    var oppoId = opponentId(game);
    var oppoHand = Cards.find({hand: oppoId}).fetch();
    var startHV = handVal([], oppoHand);
    /*var withoutDeadwood = [].concat.apply([], startHV.melded);*/
    /*var appendedHV = handVal([], withoutDeadwood);*/

    console.log(startHV.points);
    oppoHand.push(card);
    var appendedHV = handVal([], oppoHand);
    console.log(appendedHV.points);

    /*withoutDeadwood.push(card);
    var appendedHV = handVal([], withoutDeadwood);*/

    console.log("layoff");
    console.log(_id);
    console.log(appendedHV.points);

    if(appendedHV.points === 0){
      // can layoff
      console.log("layedOff");
      Cards.update(_id, {$set: {hand: oppoId}});
      return true;
    }
    else{
      console.log("cannot layoff this card");
      // TODO revisit, try to just rerender view
      /*Cards.update(_id, {$set: {hand: 'dummy'}});
      Cards.update(_id, {$set: {hand: this.userId}});*/
      return false;
    }
  },




  proposeGame: function(opponentId){
    /*var opponent = Meteor.users.findOne({_id: { $ne: this.userId } });*/
    opponent = Meteor.users.findOne(opponentId);
    var newGame = {createdBy_id:  this.userId,
                  createdBy_name: Meteor.users.findOne(this.userId).username,
                  opponent_id:    opponent._id,
                  opponent_name:  opponent.username,
                  status:         'proposed',
                  createdAt:      new Date(),
                  turn:           [this.userId, opponent._id][Math.floor(Math.random() * 2)],
                };
    Games.insert(newGame);
    return true;
  },

  deleteGame: function(gameId){
    Cards.remove({gameId:gameId});
    Games.remove({_id:gameId});
  },

});
