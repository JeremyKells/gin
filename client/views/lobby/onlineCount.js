Template.onlineCount.helpers({
  counter: function () {
    return Presences.find().fetch().length;
  }
});
