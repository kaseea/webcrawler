// const fs = require('fs');

// const DATA = {};

// d3.select('h1')
// .style('color', 'goldenrod')
// .attr('class', 'heading')
// .text('Total fees assessed by fee type from Jan 1, 2019 to now');

// d3.select('body').append('p').text('Notes on the data: dockets crawled are based on court cases that have been seen so far this year, some cases are seem multiple times over multiple years, so some fines have been given in earlier years but are still compling in this time frame. Also, fees are dismissed if there isn\'t a conviction, or dismissed for other reasons, but I believe a fine is a fine and causes tons of stress and should still be counted');
// d3.selectAll('p').style('color', 'goldenrod');


const toUSD = function toUSD(val) {
  val = val.toString();
  let monies = '$' + val.substring(0,(val.length - 3)) + '.' + val.substring((val.length - 2),(val.length));
  return monies;
}

// var width = 1020,
//     barHeight = 40;

// var x = d3.scale.linear()
//     .range([0, width]);


// var chart = d3.select(".chart")
//     .attr("width", width);

//     d3.csv("/sums-fees-by-county/pickAndChoose.txt", type, function(error, data) {
//       console.log("heeeey23");
//       // console.log('data   ' + data);
//       x.domain([0, d3.max(data, function(d) { 
        
//         console.log('description   ' + d.Description); return d.mount; })]);
    
//       console.log('data length  ' + data.length);
//       chart.attr("height", barHeight * data.length);

//       // const textstuff = names.selectAll("p")
    
//       var bar = chart.selectAll("g")
//           .data(data)
//         .enter().append("g")
//           .attr("transform", function(d, i) { return "translate(40," + i * barHeight + ")"; });
    
//       bar.append("rect")
//           .attr("width", function(d) { 
//             console.log('x.d.mount    ' + x(d.mount)) 
//             return x(d.mount); })
//           .attr("height", barHeight - 1);
    
//       bar.append("text")
//           // .attr("x", function(d) { return x(d.mount) - 3; })
//           .attr("x", 100)
//           .attr("y", barHeight / 2)
//           .attr("dy", ".35em")
//           .text(function(d) { return `${d.Description}  ${toUSD(d.mount)}`; });
//     });
    
//     function type(d) {
//       // console.log('trying to force into a value d ' + d + 'd.value ' + d.mount);
//       d.mount = +d.mount; // coerce to number
//       return d;
//     }

const width = 1020
//     barHeight = 40;

const height = 1820

    const svg = d3.select('body').select('svg');

    const titleText = 'Total fees assessed by fee type from Jan 1, 2019 to now';
const xAxisLabelText = 'Fee total by type';

function log(sel,msg) {
  console.log(msg,sel);
}

let counter = 0;
let counter2 = 0;

const render = data => {
  const xValue = d => d.mount/100;
  const yValue = d => d.Description;
  const margin = { top: 50, right: 50, bottom: 80, left: 180 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);
  
  const yScale = d3.scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // const xAxisTickFormat = number =>
  //   format('.3s')(number)
  //     .replace('G', 'B');
  
  // const xAxis = d3.axisBottom(xScale)
    // .tickFormat(xAxisTickFormat)
    // .tickSize(-innerHeight);
  
  g.append('g').call(d3.axisLeft(yScale))
    .selectAll('.domain, .tick line')
      .remove();
    // .call(log,'.tick text')
    // .selectAll('.tick text')

  g.append('g').call(d3.axisLeft(yScale))
    .selectAll('.tick text')
      // .remove()
      // .log('$$$$$$$')
      // .call(wrap, 110);
      .call(wrap, 140)

  g.append('g').call(d3.axisBottom(xScale).tickFormat(d3.format(",d")))
    .attr('transform', `translate(0,${innerHeight})`)

  // g.append('g').call(d3.axisBottom(xScale).tickSize(-innerHeight))
    


  // const xAxisG = g.append('g').call(xAxis)
  //   .attr('transform', `translate(0,${innerHeight})`);
  
  // xAxisG.select('.domain').remove();
  
  // xAxisG.append('text')
  //     .attr('class', 'axis-label')
  //     .attr('y', 65)
  //     .attr('x', innerWidth / 2)
  //     .attr('fill', 'black')
      // .text(xAxisLabelText)
  
  g.selectAll('rect').data(data)
    .enter().append('rect')
      .attr('y', d => yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      // .attr('width', 300)
      // .attr('width', d => console.log('did the thing'))
      .attr('height', yScale.bandwidth());
  
  g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .text(titleText);
};


// wrap function from internet, d3 creaters blog
function wrap(text, w2) {
  console.log(w2)
  console.log('sadsaf ' + text.constructor)
  console.log('fdsf  ' + (typeof text))
  console.log(Object.keys(text))
  // let w2 = 180;
  text.each(function() {
    console.log("BBBB")
    console.log(d3.select(this))
    let text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text("").append("tspan").attr("x", x).attr("y", 0).attr("dy", dy + "em");
        // console.log(y)
        console.log(dy)
        console.log(words)
        console.log(tspan)
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > w2) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", 0).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

d3.csv('/sums-fees-by-county/pickAndChoose.txt').then(data => {
  data.forEach(d => {
    // console.log('descrip type ' + (typeof d.Description))
    counter += 1;
    d.mount = +d.mount;
    // console.log('mount type ' + (typeof d.mount))
  });
  render(data);

console.log(counter);
});



console.log('boom');