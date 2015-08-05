Template.displayGames.events({
  'click button.startGame': function () {
    dataObject = {};
    Meteor.call("createGame", dataObject, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
         console.log('result:' + JSON.stringify(result));
      }
    });
  }
});


Template.displayGames.helpers({
  canStartGame: function(){
    if( Games.find().fetch().length === 0 ){
      return '';
    }else{
      return 'disabled';
    }
  },
  games: function(){
    return Games.find().fetch();

  }
});
