Template.player_hand.helpers({
    melded: function(){
      var cards = Cards.find({hand: Meteor.userId()}, {sort: {position: 1}});
      var hv = handVal([], cards.fetch());
      return hv.melded.map( function(i, idx){return {meld: i, index: idx}; });
      /*return hv.melded;*/
    },
    deadwood: function(){
      var cards = Cards.find({hand: Meteor.userId()}, {sort: {position: 1}});
      var hv = handVal([], cards.fetch());
      return hv.cards;
    },
    points: function(){
      var cards = Cards.find({hand: Meteor.userId()}, {sort: {position: 1}});
      var hv = handVal([], cards.fetch());
      return hv.points;
    },
    meld: function(){
      return this;
    },
    showMelded: function(){
      game = Games.findOne({});
      if (game.status === 'knocked'){      // probably more
        return true;
      }
    },
    numCards: function() {
        return Session.get('numCards');
    },
    valCards: function() {
        var cards = Cards.find({
            hand: Meteor.userId()
        }, {
            limit: Session.get('numCards'),
            sort: {
                position: 1
            }
        }).fetch();
        var ret = handVal([], cards);
        Session.set('Melded', ret.melded);
        Session.set('Deadwood', ret.cards);
        Session.set('points', ret.points);
        return 'Melded: ' + [].concat.apply([], ret.melded).map(function(a) {
            return a.rank + a.suit[0];
        }) + '  Deadwood: ' + ret.cards.map(function(a) {
            return a.rank + a.suit[0];
        }) + ' Points: ' + ret.points;
    },
});


newPosition = function(el) {
    var before = el.previousElementSibling;
    var after = el.nextElementSibling;
    var newPosition;
    if (!before) {
        return Blaze.getData(after).position - 1.0;
    } else if (!after) {
        return Blaze.getData(before).position + 1.0;
    } else {
        return (Blaze.getData(before).position + Blaze.getData(after).position) / 2.0;
    }
};


makePlayerHandSortable = function(){
  delete playerHand;
  delete playerHand0;
  delete playerHand1;
  delete playerHand2;
  delete playerhanddeadwood;

  ['playerHand', 'playerhand0', 'playerhand1', 'playerhand2', 'playerhanddeadwood'].map(function(i){
    try{
      makeSortable(document.getElementById(i) );
    } catch(err){}

    });
  };

makeSortable = function(hand) {
    /*playerHand = Sortable.create(playerHand, {*/
    Sortable.create(hand, {
        group: {
            name: "hands",
            put: true,
            pull: true,
        },
        onAdd: function(evt) {
            console.log('onAdd.playerHand:', evt);
            if (evt.from.id === 'discard') { // picked up discard
                Meteor.call('pickupDiscard', newPosition(evt.item));
                //Blaze.getData(evt.item)._id
            }
            if (evt.from.id === 'deck') { // picked up discard
                Meteor.call('pickupNewCard', newPosition(evt.item));
                evt.item.parentNode.removeChild(evt.item);
                //Blaze.getData(evt.item)._id
            }
        },
        onUpdate: function(evt) {
            console.log('onUpdate.playerHand:', evt);
            Meteor.call('sort_stop', Blaze.getData(evt.item)._id, newPosition(evt.item));
        },
        onRemove: function(evt) {
            if (Games.findOne().status === "knocked") {

                Meteor.call('layoff', Blaze.getData(evt.item)._id, function(error, result) {
                    if (result === false) {
                        el = $('#gameLayout')[0];
                        var v = Blaze.getView(el);
                        var data = Blaze.getData(el);
                        var parent = el.parentNode;
                        parent.removeChild(el);
                        Blaze.remove(v);
                        Blaze.renderWithData(Template.gameLayout, data, parent);
                    }
                });
                evt.item.parentNode.removeChild(evt.item);
            }
        },
        onStart: function(evt) {
            if (Games.findOne().status === "knocked") {
                $('#knockedDropArea').show();
            } else {
                $('#discardDropArea').show();
            }
        },
        onSort: function(evt) {
            console.log('onSort.playerHand:', evt);
        },
        onEnd: function(evt) {
            //   console.log('onEnd.playerHand:', evt);
            $('#discardDropArea').hide();
            $('#knockedDropArea').hide();
        }
    });
};



Template.player_hand.rendered = function() {
    Meteor.setTimeout(function() {
        makePlayerHandSortable();
    }, 100);
};
