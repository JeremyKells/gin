
canKnock = function(){
  try {
    // Deadwood must be sorted.  in try / catch as throws due to executing before Session variables have ben set
    return playerCards().fetch().length === 11 && Session.get('points') - _.max(Session.get('Deadwood').map(function(i){return i.val;})) < 11;
  } catch (variable) {
  } finally {
  }
};


Template.cardTable.helpers({

  canknock: canKnock,

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

makeDeckSortable = function(){
  delete deckSortable;
  deckSortable = Sortable.create(deck, {
    group: {
      name: "hands",
      pull: 'clone',
      put: false,
    },
  });
};

makeDiscardSortable = function(){
  delete discard;
  discard = Sortable.create(discard, {
    group: {
      name: "hands",
      put: false,
      pull: true,
      sort: false,
    },
  });
};

makeDiscardDroppable = function(){
  delete discardDropArea;
  discardDropArea = Sortable.create(discardDropArea, {
    group: "hands",
    onAdd: function (evt) {
      evt.item.parentNode.removeChild(evt.item);
      Meteor.call('discard', Blaze.getData(evt.item)._id);
    }
  });
};

makeKnockAreaDroppable = function(){
  delete knockedDropArea;
  knockedDropArea = Sortable.create(knockedDropArea, {
    group: "hands",
  });
};

Template.cardTable.rendered = function () {
  console.log("Template.cardTable.rendered");
  Meteor.setTimeout(function(){
    makeDeckSortable();
    makeDiscardSortable();
    makeDiscardDroppable();
    makeKnockAreaDroppable();
  }, 100);
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
