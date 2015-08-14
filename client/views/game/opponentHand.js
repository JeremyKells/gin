


Template.opponent_hand.helpers({
  opponentCards: function(){
    console.log("opponent_hand.opponentCards");
    var cards = Cards.find({hand: opponentId(this)}, {sort: {position: 1}});
    return cards;
  },
  melded: function(){
    var cards = Cards.find({hand: opponentId(this)}, {sort: {position: 1}});
    var hv = handVal([], cards.fetch());
    return hv.melded;
  },
  deadwood: function(){
    var cards = Cards.find({hand: opponentId(this)}, {sort: {position: 1}});
    var hv = handVal([], cards.fetch());
    return hv.cards;
  },
  points: function(){
    var cards = Cards.find({hand: opponentId(this)}, {sort: {position: 1}});
    var hv = handVal([], cards.fetch());
    return hv.points;
  },

  meld: function(){
    return this;
  },

});
