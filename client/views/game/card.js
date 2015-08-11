Template.card.helpers({
  suitSymbol: function(){
    return "&" + this.suit + ";";
  },
});

// Template.card.rendered = function(){
//   this.firstNode.onclick = function() {
//     console.log("discard");
//     var card = Blaze.getData(this);
//     console.log(card);
//     Meteor.call('discard', card._id);
//   };
// };
