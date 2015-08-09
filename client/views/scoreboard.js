
function results(){
    g = Games.findOne();
    var resultList = [];
    for (var i=0; i<g.result.length; i++){
      r = {};
      if(Meteor.userId() === g.createdBy_id){
        r.roundNum = i+1;
        r.myPoints = g.result[i].createdBy_points;
        r.myBonus = g.result[i].createdBy_bonus;
        r.myOpponentPoints = g.result[i].opponent_points;
        r.myOpponentBonus = g.result[i].opponent_bonus;
      }
      else {
        r.roundNum = i+1;
        r.myPoints = g.result[i].opponent_points;
        r.myBonus = g.result[i].opponent_bonus;
        r.myOpponentPoints = g.result[i].createdBy_points;
        r.myOpponentBonus = g.result[i].createdBy_bonus;
      }
      r.myHandTotal = r.myPoints + r.myBonus;
      r.myOpponentHandTotal = r.myOpponentPoints + r.myOpponentBonus;
      resultList.push(r);
    }
  return resultList;
}

function myTotal(){
  return results().map(function(i){return i.myHandTotal;}).reduce(function(a, b){return a+b;}, 0);
}

function myOpponentTotal(){
  return results().map(function(i){return i.myOpponentHandTotal;}).reduce(function(a, b){return a+b;}, 0);
}

function myGameBonus(){
  if( myTotal() > 99 )
    return 100;
  else
    return 0;
}


function opponentGameBonus(){
  if( myOpponentTotal() > 99 )
    return 100;
  else
    return 0;
}

function myLineBonus(){
  return results().map(function(i){return i.myHandTotal;}).filter(function(i){ return i > 0; }).length * 25;
}

function opponentLineBonus(){
  return results().map(function(i){return i.myOpponentHandTotal;}).filter(function(i){ return i > 0; }).length * 25;
}

function myShutoutBonus(){
  if (opponentLineBonus() === 0)
    return myTotal();
  else
      return 0;
}
function opponentShutoutBonus(){
  if (myLineBonus() === 0)
    return myOpponentTotal();
  else
    return 0;
}

function myGrandTotal(){
    return myTotal() + myGameBonus() + myLineBonus() + myShutoutBonus();
}
function opponentGrandTotal(){
    return myOpponentTotal() + opponentGameBonus() + opponentLineBonus() + opponentShutoutBonus();
}


Template.scoreboard.helpers({

  results: results,
  myLineBonus: myLineBonus,
  opponentLineBonus: opponentLineBonus,
  myGameBonus: myGameBonus,
  opponentGameBonus: opponentGameBonus,
  myTotal: myTotal,
  myOpponentTotal: myOpponentTotal,
  myShutoutBonus: myShutoutBonus,
  opponentShutoutBonus: opponentShutoutBonus,
  myGrandTotal: myGrandTotal,
  opponentGrandTotal: opponentGrandTotal,
  
  matchFinished: function(){
    return myTotal() > 99 || myOpponentTotal() > 99;
  },

  myName: function(){
    return Meteor.user().username;
  },

  opponentName: function(){
    g = Games.findOne();
    if(Meteor.userId() === g.createdBy_id){
      return g.opponent_name;
    }
    else {
      return g.createdBy_name;
    }
  },


});
