
var opponentName = function(gameObj){
  return [gameObj.opponent_name, gameObj.createdBy_name].filter(function(i){
    return i !== Meteor.user().username;
  })[0];
};

opponentId = function(gameObj){
  return [gameObj.opponent_id, gameObj.createdBy_id].filter(function(i){
    return i !== Meteor.userId();
  })[0];
};

canKnock = function(){
  try {
    // Deadwood must be sorted.  in try / catch as throws due to executing before Session variables have ben set
    return playerCards().fetch().length === 11 && Session.get('points') - Session.get('Deadwood')[0].val < 11;
  } catch (variable) {
  } finally {
  }
};


Template.gameLayout.events({
  "click #knock": function(){
    console.log('knock');
    Meteor.call('knock', this._id);

  },
  "click #deletegame": function(){
    Meteor.call('deleteGame', this._id);
    Meteor.setTimeout(function(){
      Router.go('/lobby');
    }, 1000);

  },
});


Template.gameLayout.helpers({

  canknock: canKnock,

  whosTurn: function(){
    if(Meteor.userId() === this.turn){
      if( playerCards().fetch().length === 11 ){
        if (canKnock() === true){
          return 'your turn, ' + Meteor.user().username + '.  Please Discard (or Knock)';
        }
        return 'your turn, ' + Meteor.user().username + '.  Please Discard';
      }
      return 'your turn, ' + Meteor.user().username + '.';
    } else{
      return opponentName(this) + "'s turn.";
    }
  },
  opponent_name: function(argument){
    return opponentName(this);
  },

  your_name: function(){
    return Meteor.user().username;
  },
});


sumCardValues = function(cards){
  return cards.reduce(function(pv, cv) { return pv + Math.min(cv.val, 10); }, 0);
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


remaining = function(meld, cards){
  var copy = cards.slice(0);
  meld.map(function(b){ copy.splice(copy.indexOf(b), 1);} );
  return copy;
};

handValue = function(melded, cards){
  // cards = Cards.find({hand: Meteor.userId()}, {limit: Session.get('numCards'), sort: {rank: 1}}).fetch();

  var melds = [];
  // melds.push(sumCardValues(cards));

  var sets = {};
  for (var i=0; i<cards.length; i++){
    var c = cards[i];
    var rank = sets[c.rank] || [];
    rank.push(c);
    sets[c.rank] = rank;
  }

  for (var rank in sets) {
    if (sets.hasOwnProperty(rank)) {
      if( sets[rank].length > 2 ){
        var meld = sets[rank].slice(0);
        var unmelded = remaining(meld, cards);
        var ret = handValue(melded.concat(meld), unmelded);
        melds.push(ret);
        if(sets[rank].length === 4){
          for(i=0; i<4; i++){
            var m = meld.slice(0);
            m.splice(i, 1);
            ret = handValue(melded.concat(m), remaining(m, cards));
            melds.push(ret);
          }
        }
      }
    }
  }
  var suits =  {};
  for ( i=0; i<cards.length; i++){
    var c = cards[i];
    var s = suits[c.suit] || [];
    s.push(c);
    suits[c.suit] = s;
  }

  function sorter(a, b){
    if(a.val < b.val)
      return -1;
    else
      return 1;
    }

  function isRun(cards){
    var vals = cards.map(function(c){ return c.val;});
    for(var j=1; j < vals.length; j++){
      if( vals[j-1] + 1 !== vals[j]){
        return false;
      }
    }
    return true;
  }

  for (var suit in suits) {
    if (suits.hasOwnProperty(suit)) {
      suitCards = suits[suit];

      if( suitCards.length > 2 ){
        suitCards.sort(sorter);
        for (var j=suitCards.length; j>2; j--){ // j is slice length to test
          for(var k=0; k<suitCards.length-j+1; k++  ){
            testCards = suitCards.slice(k,k+j);
            if(isRun(testCards)){
              var cc = remaining(testCards, cards);
              var ret = handValue(melded.concat(testCards), cc);
              melds.push(ret);
            }
          }
        }
      }
    }
  }

  if(melds.length == 0){
    var retobj = {};
    retobj.melded = melded;
    retobj.cards = cards;
    retobj.points = sumCardValues(cards);
    return retobj;
  }

  var min = melds[0];
  for (var i=1; i<melds.length; i++){
    if (melds[i].points < min.points){
      min = melds[i];
    }
  }
  return min;

};

playerCards = function(){
  cards = Cards.find({hand: Meteor.userId()}, {sort: {position: 1}});
  if(cards.fetch().length === 0){
    Router.go('/lobby');
  }
  return cards;
};

Template.registerHelper("playerCards", playerCards);

Template.registerHelper("opponentCards", function(){
    cards = Cards.find({hand: opponentId(this)}, {sort: {position: 1}});
    return cards;
});

Template.player_hand.helpers({
  numCards: function(){
    return Session.get('numCards');
  },
  valCards: function(){
    var cards = Cards.find({hand: Meteor.userId()}, {limit: Session.get('numCards'), sort: {position: 1}}).fetch();
    var ret = handValue([], cards);
    Session.set('Melded', ret.melded);
    Session.set('Deadwood', ret.cards);
    Session.set('points', ret.points);
    return 'Melded: ' + ret.melded.map(function(a){ return a.rank + a.suit[0];}) + '  Deadwood: ' + ret.cards.map(function(a){ return a.rank + a.suit[0];}) + ' Points: ' + ret.points;
  },
});

Template.card.helpers({
  suitSymbol: function(){
    return "&" + this.suit + ";";
  },
});


Template.player_hand.rendered = function () {
  $( "#sortable" ).sortable({
    distance: 50,

    stop: function(e, ui){
        el = ui.item.get(0);
        console.log("sortable stop event");

        before = el.previousElementSibling;
        after = el.nextElementSibling;

        if(!before){
          newPosition = Blaze.getData(after).position - 1.0;
        } else if (!after){
          newPosition = Blaze.getData(before).position + 1.0;
        } else{
          newPosition = ( Blaze.getData(before).position +  Blaze.getData(after).position ) / 2.0;
        }
        Meteor.call('sort_stop', Blaze.getData(el)._id, newPosition);
    },

  });
};

Template.card.rendered = function(){
  this.firstNode.onclick = function() {
    console.log("discard");
    var card = Blaze.getData(this);
    console.log(card);
    Meteor.call('discard', card._id);
  };
};

Template.cardTable.helpers({
  discard: function(){
    return Cards.find({hand: 'discard'});
  },
  suitSymbol: function(){
    return "&" + this.suit + ";";
  },
});

Template.cardTable.events({
  "click .deck": function(event, template){
    console.log("click .deck");
    Meteor.call('pickupNewCard');
  },
  "click .discard": function(event, template){
      console.log("click .discard");
      Meteor.call('pickupDiscard');
  }

});
