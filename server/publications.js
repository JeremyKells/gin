Meteor.publish('userPresence', function() {
  // Setup some filter to find the users your user
  // cares about. It's unlikely that you want to publish the
  // presences of _all_ the users in the system.

  // If for example we wanted to publish only logged in users we could apply:
  // filter = { userId: { $exists: true }};
  var filter = { userId: { $exists: true }};
  return Presences.find(filter, { fields: { state: true, userId: true }});
});



Meteor.publish('games', function(userId){
  var filter = { $or: [{createdBy_id: userId}, {opponent_id: userId}]};
  return Games.find(filter);
});
