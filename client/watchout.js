// start slingin' some d3 here.
var myData = [];
var heroData = [{id: 0, x: 300, y: 300}];
var score = 0;
var highScore = 0;
var collisions = 0;

for (var i = 0; i < 9; i++) {
  myData.push({id: i, x: i * 50, y: (i + 1) * 50, spin: false});  
}

var height = 750;
var width = 450;
var selection = d3.select('.board').append('svg:svg')
  .attr('height', 750).attr('width', 750);




var game = function() {

  var hero = selection.selectAll('.hero').data(heroData, function (d) { return d.id; });

  var asteroid = selection.selectAll('.shuriken').data(myData, function(d) { return d.id; });
    
  asteroid.transition().duration('2000')
  //   .attrTween('transform', function() {
  //     var i = d3.interpolate(0, 360);
  //     return function(t) {
  //       return 'rotate(' + i(t) + ',100,100)';
  //     };
  //   });
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .style({'transform': 'rotate(360 25 25)'});

  // asteroid.style('-webkit-transform', function (d) {
  //   if (d.spin === false) {
  //     d.spin = true;
  //     return 'rotateZ(180deg)';
  //   } else {
  //     d.spin = false;
  //     return 'rotateZ(0deg)';
  //   }
  // });

  // asteroid.append('animateTransform').attr('attributeName', 'transform')
  //   .attr('attributeType', 'XML').attr('type', 'rotate')
  //   .attr('from', '0').attr('to', '360').attr('dur', '25s')
  //   .attr('repeatCount', 'indefinite');

  asteroid.enter().append('image')
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', 50)
    .attr('height', 50)
    .attr('class', 'shuriken')
    .attr('xlink:href', 'shuriken.gif-c200');
    // .on('mouseover', function() {
    //   highScore = score > highScore ? score : highScore;
    //   d3.select('.highscore').select('span').text(highScore.toString());

    //   score = 0;
    //   d3.select('.current').select('span').text(score.toString());


    //   d3.select('.collisions').select('span').text((++collisions).toString());
    // });  

  asteroid.exit().remove();

  hero.enter().append('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 25)
    .attr('class', 'hero')
    .attr('width', 50)
    .attr('height', 50);
  

  hero.exit().remove();

};

setInterval(function() {
  score++;
  d3.select('.current').select('span').text(score.toString());

  myData.forEach(function(e) {

    e.x = Math.ceil(Math.random() * width);
    e.y = Math.ceil(Math.random() * height);
  });
  game();
}, 1000);

setInterval(function() {
  var shurikenCoords = d3.selectAll('.shuriken')[0].map(function(e) {
    return {x: e.x.animVal.value, y: e.y.animVal.value};
  });

  var heroCoords = heroData[0];

  var collision = shurikenCoords.some(function(e) {
    var distance = Math.sqrt(Math.pow((e.x - heroCoords.x), 2) + Math.pow((e.y - heroCoords.y), 2));
    return distance <= 50;
  });

  if (collision) {
    highScore = score > highScore ? score : highScore;
    d3.select('.highscore').select('span').text(highScore.toString());

    score = 0;
    d3.select('.current').select('span').text(score.toString());


    d3.select('.collisions').select('span').text((++collisions).toString());
  }
}, 10);