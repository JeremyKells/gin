Template.player_hand.helpers({
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

makePlayerHandSortable = function() {
    delete playerHand;
    playerHand = Sortable.create(playerHand, {
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
                        var ph = $('div.player_hand')[0];
                        var v = Blaze.getView(ph);
                        var data = Blaze.getData(ph);
                        var parent = ph.parentNode;
                        Blaze.remove(v);
                        Blaze.renderWithData(Template.player_hand, data, parent);
                    }
                });
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
            console.log('onStart.playerHand:', evt);
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
