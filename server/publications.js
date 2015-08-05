Meteor.publish('userPresence', function() {
  var filter = { userId: { $exists: true }};
  return Presences.find(filter, { fields: { state: true, userId: true }});
});

Meteor.publish('games', function(){
  var filter = { $or: [{createdBy_id: this.userId}, {opponent_id: this.userId}]};
  //var filter = { $or: [{createdBy_id: userId}, {opponent_id: userId}]};
  return Games.find(filter);
});


Meteor.publish("playerCards", function(){
  return Cards.find({hand: this.userId}); //Filter out Deck, below the top discard, and opponent's hand
});
Meteor.publish("discard", function(){
  return Cards.find({hand: 'discard'}, {sort: {position: -1}, limit: 1});
});
