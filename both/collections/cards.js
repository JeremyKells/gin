Cards = new Mongo.Collection("cards");

Cards.allow({

  update: function(userId, card, fields, modifier){
    console.log([userId, card, fields, modifier]);
    console.log("(userId === card.hand = " + (userId === card.hand));
    console.log("(fields.length === 1 && fields[0] === 'position') = " + (fields.length === 1 && fields[0] === 'position'));

      if(userId === card.hand){
        if(fields.length === 1 && fields[0] === 'position')
          return true;
      }
    return false;
  },
});


Cards.deny({
  insert: function(){
    return true;
  },
  update: function(){
    return false;
  },
  remove: function(){
    return true;
  }
});
