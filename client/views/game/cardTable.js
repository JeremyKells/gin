
Template.cardTable.helpers({
  discard: function(){
    return Cards.find({hand: 'discard'});
  },
  suitSymbol: function(){
    return "&" + this.suit + ";";
  },
  discardOptions: function(){
    return {
      onAdd: function (evt){
        console.log('onAdd.foo:', evt);
        if (evt.currentTarget.className === "discard playingCards" && Blaze.getData(evt.item).hand === Meteor.userId()){
          Meteor.call('discard', Blaze.getData(evt.item)._id);
        }
         },
      /*onUpdate: function (evt){
        console.log('onUpdate.foo:', evt);
        },
      onRemove: function (evt){
        console.log('onRemove.foo:', evt);
        },
      onStart:function(evt){
        console.log('onStart.foo:', evt);
        },*/
      onSort:function(evt){
        console.log('onStart.foo:', evt);
        },
      /*onEnd: function(evt){
        console.log('onEnd.foo:', evt);
        }*/
    };
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
