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
    return this.status === 'accepted';
  },
});

Template.game.events({
  "click .acceptButton": function(event, template){
    Games.update(this._id, { $set:{
                  status: 'accepted' }});
  },
  "click .declineButton": function(event, template){
    Games.remove(this._id);  // TODO: Change to Meteor.method, transitons

  },
  "click .cancelButton": function(event, template){
    Games.remove(this._id);  // TODO: Change to Meteor.method, transitons
  },

});
