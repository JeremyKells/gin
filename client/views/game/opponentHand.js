



Template.opponent_hand.helpers({
  endHand: function(){
    var game = Games.findOne();
    return game.status !== 'accepted';
  },
  opponentCards: function(){
    console.log("opponent_hand.opponentCards");
    var game = Games.findOne();
    var cards = Cards.find({hand: opponentId(game)}, {sort: {position: 1}});
    return cards;
  },
  melded: function(){
    var game = Games.findOne();
    var cards = Cards.find({hand: opponentId(game)}, {sort: {position: 1}});
    var hv = handVal([], cards.fetch());
    return hv.melded;
  },
  deadwood: function(){
    var game = Games.findOne();
    var cards = Cards.find({hand: opponentId(game)}, {sort: {position: 1}});
    var hv = handVal([], cards.fetch());
    return hv.cards;
  },
  points: function(){
    var game = Games.findOne();
    var cards = Cards.find({hand: opponentId(game)}, {sort: {position: 1}});
    var hv = handVal([], cards.fetch());
    return hv.points;
  },

  meld: function(){
    return this;
  },

});
