Meteor.startup(function () {

    // Games.remove({});
    Games.insert({createdBy_id:   'QTRXP7YEfbq8HSdkS',
                  createdBy_name: 'Hana',
                  opponent_id:    '6E9qTZxXzXiWJwC72',
                  opponent_name:  'Ellie',
                  status:         'proposed',
                  createdAt:      new Date(),
                  });

    Games.insert({createdBy_id:   'fakefakefakefake2',
                  createdBy_name: 'Bixx',
                  opponent_id:    'fakefakefakefake1',
                  opponent_name:  'Frank',
                  status:         'proposed',
                  createdAt:      new Date(),
                  });

});


Meteor.methods({
  startGame: function(){
    // console.log("startGame by " + this.userId );
    // console.log("startGame by " + Meteor.users.findOne(this.userId).username );

    var opponent = Meteor.users.findOne({_id: { $ne: this.userId } });
    // console.log("opponent " + opponent.username + ' ( ' + opponent._id + ')');

    var filter = { $or: [{createdBy_id: this.userId}, {opponent_id: this.userId}]};
    // console.log("Games:");

    // console.log( JSON.stringify( Games.find({}).fetch())  );


    var newGame = {createdBy_id:  this.userId,
                  createdBy_name: Meteor.users.findOne(this.userId).username,
                  opponent_id:    opponent._id,
                  opponent_name:  opponent.username,
                  status:         'proposed',
                  createdAt:      new Date(),
                };
    Games.insert(newGame);
    return true;
  }
});
