Template.lobby.helpers({
  loggedInUsers: function(){
    var ids = _.uniq(Presences.find({}, {fields: {userId: true} }).fetch().map(function(i){return i.userId;}), false);
    ids = ids.filter(function(i){if(i !== Meteor.userId()) return true; else return false;});
    return Meteor.users.find({_id: { $in: ids }}).fetch();
  },
  isLoggedIn: function(){
    if(Meteor.userId()){
      return true;
    } else {
      return false;
    }
  },
  games: function(){
    return Games.find().fetch();
  }

});

Template.lobby.rendered = function(){
  Tracker.autorun(function(){
    var game = Games.findOne({status: 'accepted'});
    if(game){
      Router.go('/game/' + game._id);
    }
  });
};

Template.lobby.events({
  'click button.proposeGame': function () {
    Meteor.call("proposeGame", this._id, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
         /*console.log('result:' + JSON.stringify(result));*/
      }
    });
  }
});

findGames = function(oppo, player){
  return Games.find(
    {$or:
      [{status: 'proposed', createdBy_id: oppo, opponent_id: player},
       {status: 'proposed', createdBy_id: player, opponent_id: oppo}]
    }).fetch();
  };

Template.user.helpers({

  game: function(){
      /*console.log("user.game");*/
      return findGames(this._id, Meteor.userId())[0];
  },

  haveProposal: function(){
    var games = findGames(this._id, Meteor.userId());
    if( games.length === 0 ){
      return '';
    }else{
      return 'disabled';
    }
  },

});
