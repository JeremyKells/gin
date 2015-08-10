
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
