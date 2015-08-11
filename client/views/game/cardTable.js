
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

Template.cardTable.rendered = function () {

  Meteor.setTimeout(function(){

    deckSortable = Sortable.create(deck, {
      group: {
        name: "hands",
        pull: 'clone',
        put: false,
      },
      //sort: false,
      onAdd: function (evt){
        console.log('onAdd.deck:', evt);
        },
      onUpdate: function (evt){
        console.log('onUpdate.deck:', evt);
        },
      onRemove: function (evt){
        console.log('onRemove.deck:', evt);
        },
      onStart:function(evt){
         console.log('onStart.deck:', evt);
      },
      onSort:function(evt){
        console.log('onStart.deck:', evt);
        },
      onEnd: function(evt){
         console.log('onEnd.deck:', evt);
        }
    });

    discard = Sortable.create(discard, {
      group: {
        name: "hands",
        put: false,
        pull: true,
        sort: false,
      },

      onAdd: function (evt){
       //  if(evt.currentTarget.classList.contains('discard')){
       //    Meteor.call('discard', Blaze.getData(evt.item)._id);
       //  }
       //  if( evt.currentTarget.classList.contains('player_hand') && evt.from.classList.contains('discard') ){
       //    Meteor.call('pickupDiscard');
       //  }
        console.log('onAdd.discard:', evt);
        },
      onUpdate: function (evt){
        console.log('onUpdate.discard:', evt);
        },
      onRemove: function (evt){
        console.log('onRemove.discard:', evt);
        },
      onStart:function(evt){
      //   console.log('onStart.discard:', evt);
      },
      onSort:function(evt){
        console.log('onStart.discard:', evt);
        },
      onEnd: function(evt){
      //   console.log('onEnd.discard:', evt);
        }

    });
    console.log(discard);

    droppable = Sortable.create(droppable, {
      group: "hands",

      onAdd: function (evt) {
        evt.item.parentNode.removeChild(evt.item);
        Meteor.call('discard', Blaze.getData(evt.item)._id);
      }
    });
  }, 1000);

};

// Template.cardTable.events({
//   "click .deck": function(event, template){
//     console.log("click .deck");
//     Meteor.call('pickupNewCard');
//   },
//   // "click .discard": function(event, template){
//   //     console.log("click .discard");
//   //     Meteor.call('pickupDiscard');
//   // }
//
// });
