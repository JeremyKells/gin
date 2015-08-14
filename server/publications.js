Meteor.publish('userPresence', function() {
  var filter = { userId: { $exists: true }};
  return [Presences.find(filter, { fields: { state: true, userId: true }}),
          Meteor.users.find({}, {fields: {username: 1}})];
});


Meteor.publish('games', function(){
  var filter = { $or: [{createdBy_id: this.userId}, {opponent_id: this.userId}]};
  //var filter = { $or: [{createdBy_id: userId}, {opponent_id: userId}]};
  return Games.find(filter);
});


Meteor.publish("playerCards", function(){
  return Cards.find({$or: [{hand: this.userId},
                           {showOpponent: true, hand: { $ne: 'discard' } }
                          ]});
});



// Meteor.publish("playerCards", function(){
//   return Cards.find({hand: this.userId});
//   // return Cards.find({$or: [{hand: this.userId}]
//                           //   {showOpponent : true,
//                           //    hand : {$not: 'discard'}
//                           //    }
//                           // ]
//                           // });
// });


opponentId = function(gameObj){
  return [gameObj.opponent_id, gameObj.createdBy_id].filter(function(i){
    return i !== this.userId;
  })[0];
};

Meteor.publish("discard", function(){
  return Cards.find({hand: 'discard'}, {sort: {position: -1}, limit: 1});
});
