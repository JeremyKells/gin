
var opponentName = function(gameObj){
  return [gameObj.opponent_name, gameObj.createdBy_name].filter(function(i){
    return i !== Meteor.user().username;
  })[0];

  // if(Meteor.userId() === gameObj.createdBy_id){
  //   return gameObj.opponent_name;
  // } else{
  //   return gameObj.createdBy_name;
  // }
};

Template.gameLayout.helpers({
  whosTurn: function(){
    if(Meteor.userId() === this.turn){
      return 'your turn, ' + Meteor.user().username;
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

Template.player_hand.helpers({
  playerCards: function(){
    return Cards.find({hand: Meteor.userId()}, {sort: {position: 1}});
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
        Cards.update({_id: Blaze.getData(el)._id}, {$set: {position: newPosition}});
    },

  });
};

Template.card.rendered = function(){
  console.log(this);

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
