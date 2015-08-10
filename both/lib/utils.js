sumCardValues = function(cards){
  return cards.reduce(function(pv, cv) { return pv + Math.min(cv.val, 10); }, 0);
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


remaining = function(meld, cards){
  var copy = cards.slice(0);
  meld.map(function(b){ copy.splice(copy.indexOf(b), 1);} );
  return copy;
};


sorter = function (a, b){
  if(a.val < b.val)
    return -1;
  else
    return 1;
  }

function isRun(cards){
  var vals = cards.map(function(c){ return c.val;});
  for(var j=1; j < vals.length; j++){
    if( vals[j-1] + 1 !== vals[j])
      return false;
  }
  return true;
}

handValue = function(melded, cards){
  // cards = Cards.find({hand: Meteor.userId()}, {limit: Session.get('numCards'), sort: {rank: 1}}).fetch();

  cards.sort(sorter);

  var melds = [];
  // melds.push(sumCardValues(cards));

  var suits =  {};
  var sets = {};

  for (var i=0; i<cards.length; i++){
    var c = cards[i];

    var rank = sets[c.rank] || [];
    rank.push(c);
    sets[c.rank] = rank;

    var s = suits[c.suit] || [];
    s.push(c);
    suits[c.suit] = s;
  }

  for (var rank in sets) {
    if (sets.hasOwnProperty(rank)) {
      if( sets[rank].length > 2 ){
        var meld = sets[rank].slice(0);
        var unmelded = remaining(meld, cards);
        var ret = handValue(melded.concat(meld), unmelded);
        melds.push(ret);
        if(sets[rank].length === 4){
          for(i=0; i<4; i++){
            var m = meld.slice(0);
            m.splice(i, 1);
            ret = handValue(melded.concat(m), remaining(m, cards));
            melds.push(ret);
          }
        }
      }
    }
  }

  for (var suit in suits) {
    if (suits.hasOwnProperty(suit)) {
      suitCards = suits[suit];

      if( suitCards.length > 2 ){
        //suitCards.sort(sorter);
        for (var j=suitCards.length; j>2; j--){ // j is slice length to test
          for(var k=0; k<suitCards.length-j+1; k++  ){
            testCards = suitCards.slice(k,k+j);
            if(isRun(testCards)){
              var cc = remaining(testCards, cards);
              var ret = handValue(melded.concat(testCards), cc);
              melds.push(ret);
            }
          }
        }
      }
    }
  }

  if(melds.length === 0){
    var retobj = {};
    retobj.melded = melded;
    retobj.cards = cards;
    retobj.points = sumCardValues(cards);
    return retobj;
  }

  var min = melds[0];
  for (var i=1; i<melds.length; i++){
    if (melds[i].points < min.points){
      min = melds[i];
    }
  }
  return min;
};

join = function(melded, meld){
  //return melded.concat(meld)
  var ret = melded.slice(0);
  ret.push(meld);

  return ret;
};


handVal = function(melded, cards){
  // cards = Cards.find({hand: Meteor.userId()}, {limit: Session.get('numCards'), sort: {rank: 1}}).fetch();

  cards.sort(sorter);

  var melds = [];
  // melds.push(sumCardValues(cards));

  var suits =  {};
  var sets = {};

  for (var i=0; i<cards.length; i++){
    var c = cards[i];

    var rank = sets[c.rank] || [];
    rank.push(c);
    sets[c.rank] = rank;

    var s = suits[c.suit] || [];
    s.push(c);
    suits[c.suit] = s;
  }

  for (var rank in sets) {
    if (sets.hasOwnProperty(rank)) {
      if( sets[rank].length > 2 ){
        var meld = sets[rank].slice(0);
        var unmelded = remaining(meld, cards);
        var ret = handVal(join(melded,meld), unmelded);
        melds.push(ret);
        if(sets[rank].length === 4){
          for(i=0; i<4; i++){
            var m = meld.slice(0);
            m.splice(i, 1);
            ret = handVal(join(melded,m), remaining(m, cards));
            melds.push(ret);
          }
        }
      }
    }
  }

  for (var suit in suits) {
    if (suits.hasOwnProperty(suit)) {
      suitCards = suits[suit];

      if( suitCards.length > 2 ){
        //suitCards.sort(sorter);
        for (var j=suitCards.length; j>2; j--){ // j is slice length to test
          for(var k=0; k<suitCards.length-j+1; k++  ){
            testCards = suitCards.slice(k,k+j);
            if(isRun(testCards)){
              var cc = remaining(testCards, cards);
              var ret = handVal(join(melded,testCards), cc);
              melds.push(ret);
            }
          }
        }
      }
    }
  }

  if(melds.length === 0){
    var retobj = {};
    retobj.melded = melded;
    retobj.cards = cards;
    retobj.points = sumCardValues(cards);
    return retobj;
  }

  var min = melds[0];
  for (var i=1; i<melds.length; i++){
    if (melds[i].points < min.points){
      min = melds[i];
    }
  }
  return min;
};
