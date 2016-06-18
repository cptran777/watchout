var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioElement = document.getElementById('audioElement');
var audioSrc = audioCtx.createMediaElementSource(audioElement);
var analyzer = audioCtx.createAnalyser();

// Bind our analyser to the media element source.
audioSrc.connect(analyzer);
audioSrc.connect(audioCtx.destination);

var frequencyData = new Uint8Array(200);

var width = 960;
var height = 500;

var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; });
var audioBall = [{radius: Math.random() * 12 + 4}];
var root = nodes[0];
var color = d3.scale.category10();

root.radius = 0;
root.fixed = true;

var force = d3.layout.force()
    .gravity(0.05)
    .charge(function(d, i) { return i ? 0 : -2000; })
    .nodes(nodes)
    .size([width, height]);

force.start();

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

svg.selectAll('circle')
    .data(nodes.slice(1))
  .enter().append('circle')
    .attr('r', function(d) { return d.radius; })
    .style('fill', function(d, i) { return color(i % 3); });

force.on('tick', function(e) {
  var q = d3.geom.quadtree(nodes);
  var i = 0;
  var n = nodes.length;

  while (++i < n) {
    q.visit(collide(nodes[i]));
  }

  svg.selectAll('circle')
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; });
});

setInterval(function moveStuff() {
  analyzer.getByteFrequencyData(frequencyData);
  var frequency = frequencyData[frequencyData.length - 1];
  console.log(frequency);
  if (frequency > 0) {
    root.px = (Math.random() * width) * 0.75;
    root.py = Math.random() * height * 0.75;
  }
  root.radius = frequency * 1.3;
  force.resume();
}, 770);

// svg.on('mousemove', function() {
//   var p1 = d3.mouse(this);
//   root.px = p1[0];
//   root.py = p1[1];
//   force.resume();
// });

var collide = function(node) {
  var r = node.radius + 16;
  var nx1 = node.x - r;
  var nx2 = node.x + r;
  var ny1 = node.y - r;
  var ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x;
      var y = node.y - quad.point.y;
      var l = Math.sqrt(x * x + y * y);
      var r = node.radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
};