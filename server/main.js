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

    //Calculate score, update result

    /*{ createdBy_points: 10,
    createdBy_bonus: 25,
    opponent_points: 0,
    opponent_bonus: 0,
    result: 'Gin' }*/

    Games.update(_id, { $set:{
                  knocked: this.userId,
                  status: 'endgame' }});
  },

  sort_stop: function(card_id, newPosition){
    Cards.update({_id: card_id}, {$set: {position: newPosition}});
  },

  deleteGame: function(_id){
      Games.remove(_id);
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
    deck = _.shuffle(deck);

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

    takeCard = function(hand){
      var card = deck.pop();
      Cards.insert({gameId: _id,
                    hand: hand,
                    position: i,    // i is coming from outside this scope, probably should fix.
                    suit: card.suit,
                    rank: card.rank,
                    val: val(card.rank)
                    });
    };

    for (var i=0; i<10; i++){
      takeCard(game.createdBy_id);
      takeCard(game.opponent_id);
    }

    i=0;
    takeCard('discard');

    for (i=0; i<31; i++){
      takeCard('deck');
    }

    Games.update(_id, { $set:{
                  status: 'accepted',
                  result: [] }});

  },

  pickupDiscard: function(){
    // Check it's appropriate at this point
    card_id = Cards.findOne({hand: 'discard'}, {sort: {position: -1}, limit: 1})._id;
    newPosition = Cards.findOne({hand: this.userId}, {sort: {position: -1}, limit: 1}).position + 1;
    Cards.update(card_id, { $set: { hand: this.userId, position: newPosition } } );
  },

  pickupNewCard: function(){
    // TODO: Check it's appropriate at this point
    console.log('pos: ' + Cards.findOne({hand: 'deck'}, {sort: {position: -1}, limit: 1}).position);

    card_id = Cards.findOne({hand: 'deck'}, {sort: {position: -1}, limit: 1})._id;
    newPosition = Cards.findOne({hand: this.userId}, {sort: {position: -1}, limit: 1}).position + 1;
    Cards.update(card_id, { $set: { hand: this.userId, position: newPosition } } );
    // TODO: Needs to return values to client, indicate number of cards left, or fail/not allowed

  },

  discard: function(_id){
    // Check it's appropriate at this point
    var cards = Cards.find({hand: this.userId}).fetch();
    if(cards.length === 11){
      var discards = Cards.find({hand: 'discard'}).fetch();
      var discardPosition = discards.length;  // probably cheaper to cache
      Cards.update(_id, { $set: { hand: 'discard', position: discards.length } });

      // Rotate turn
      var game = Games.find(discards[0].gameId).fetch()[0];
      if (game.turn === game.createdBy_id ){
        Games.update(game._id, { $set: {turn: game.opponent_id }});
      } else {
        Games.update(game._id, { $set: {turn: game.createdBy_id }});
      }
    }else{ throw new Meteor.Error(403, 'Cannot discard');
    }
  },

  createGame: function(){
    var opponent = Meteor.users.findOne({_id: { $ne: this.userId } });



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
