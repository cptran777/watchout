// start slingin' some d3 here.
var myData = [];
var score = 0;

for (var i = 0; i < 9; i++) {
  myData.push({id: i, x: i * 50, y: (i + 1) * 50});  
}

var height = 750;
var width = 450;
var selection = d3.select('.board').append('svg:svg')
  .attr('height', 750).attr('width', 750);




var game = function() {

  var asteroid = selection.selectAll('image').data(myData, function(d) { return d.id; });
    
  asteroid.transition()
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; });

  asteroid.enter().append('svg:image')
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', 50)
    .attr('height', 50)
    .attr('xlink:href', 'asteroid.png');  

  console.log(myData);
  asteroid.exit().remove();

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