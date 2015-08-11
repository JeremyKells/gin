Template.player_hand.helpers({
  numCards: function(){
    return Session.get('numCards');
  },
  valCards: function(){
    var cards = Cards.find({hand: Meteor.userId()}, {limit: Session.get('numCards'), sort: {position: 1}}).fetch();
    var ret = handVal([], cards);
    Session.set('Melded', ret.melded);
    Session.set('Deadwood', ret.cards);
    Session.set('points', ret.points);
    return 'Melded: ' + [].concat.apply([], ret.melded).map(function(a){ return a.rank + a.suit[0];}) + '  Deadwood: ' + ret.cards.map(function(a){ return a.rank + a.suit[0];}) + ' Points: ' + ret.points;
  },
});


newPosition = function(el){
  var before = el.previousElementSibling;
  var after = el.nextElementSibling;
  var newPosition;
  if(!before){
    return Blaze.getData(after).position - 1.0;
  } else if (!after){
    return Blaze.getData(before).position + 1.0;
  } else{
    return ( Blaze.getData(before).position +  Blaze.getData(after).position ) / 2.0;
  }

},

 Template.player_hand.rendered = function () {
   console.log("Template.player_hand.rendered");

   playerHand = Sortable.create(playerHand, {
      group: "hands",
      put: true,
      pull: true,
      onAdd: function (evt){
       //  if(evt.currentTarget.classList.contains('discard')){
       //    Meteor.call('discard', Blaze.getData(evt.item)._id);
       //  }
       //  if( evt.currentTarget.classList.contains('player_hand') && evt.from.classList.contains('discard') ){
       //    Meteor.call('pickupDiscard');
       //  }

        console.log('onAdd.playerHand:', evt);
        if(evt.from.id === 'discard'){ // picked up discard
          Meteor.call('pickupDiscard', newPosition(evt.item));
          //Blaze.getData(evt.item)._id
        }
        },
      onUpdate: function (evt){
        console.log('onUpdate.playerHand:', evt);
        Meteor.call('sort_stop', Blaze.getData(evt.item)._id, newPosition(evt.item));
        },
      onRemove: function (evt){
        console.log('onRemove.playerHand:', evt);
        },
      onStart:function(evt){
        $('#droppable').show();
        // console.log('onStart.playerHand:', evt);
      },
      onSort:function(evt){
        console.log('onStart.playerHand:', evt);
        },
      onEnd: function(evt){
      //   console.log('onEnd.playerHand:', evt);
        $('#droppable').hide();
        }
    });

    console.log(playerHand);

//   $( "#sortable" ).sortable({
//     distance: 50,
//
//     stop: function(e, ui){
//         el = ui.item.get(0);
//         console.log("sortable stop event");
//
    //     before = el.previousElementSibling;
    //     after = el.nextElementSibling;
    //
    //     if(!before){
    //       newPosition = Blaze.getData(after).position - 1.0;
    //     } else if (!after){
    //       newPosition = Blaze.getData(before).position + 1.0;
    //     } else{
    //       newPosition = ( Blaze.getData(before).position +  Blaze.getData(after).position ) / 2.0;
    //     }
    //     Meteor.call('sort_stop', Blaze.getData(el)._id, newPosition);
    // },
//
//   });
};
