Router.configure({
    layoutTemplate: 'mainLayout'
});

Router.route('/lobby');
Router.route('/', {
    template: 'lobby'
});

Router.route('/game/:_id', function () {
  this.render('gameLayout', {
    data: function () {
      return Games.findOne({_id: this.params._id});
    }
  });
},  {
  name: 'game.show',
  waitOn: function(){
    return [Meteor.subscribe('playerCards'), Meteor.subscribe('discard')];
  },
});
