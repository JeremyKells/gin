Template.game.helpers({
  waiting: function(){
    return this.status === 'proposed' && this.createdBy_id  === Meteor.userId();
  },
  proposal: function(){
    return this.status === 'proposed' && this.opponent_id  === Meteor.userId();

  },
  opponent: function(){
    return this.opponent_name;
  },
  proposer: function(){
    return this.createdBy_name;
  },
  accepted: function(){
    if(this.status === 'accepted'){

    //TODO:  figure out better way to handle this
      Router.go('/game/' + this._id);
      }
    return this.status === 'accepted';
    // /TODO
  }
});



Template.game.events({
  "click .acceptButton": function(event, template){
    Meteor.call("startGame", this._id, function(error, result){
      console.log("startGame returned (error, result): " + error + ' / ' + result);

      if(error){
        console.log("error", error);
      }
      if(result){
        Router.go('game.show', {_id: this._id});
      }
    });

  },
  "click .declineButton": function(event, template){
    // TODO, transitons
    Meteor.call('deleteGame', this._id);
  },
  "click .cancelButton": function(event, template){
    // TODO, transitons
    Meteor.call('deleteGame', this._id);
  },


});
