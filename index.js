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


const width = 1020

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
  
  g.append('g').call(d3.axisLeft(yScale))
    .selectAll('.domain, .tick line')
      .remove();

      // for some reason I was doing call axisLeft, just select
  g.selectAll('.tick text')
      .call(wrap, 140)

  g.append('g').call(d3.axisBottom(xScale).tickFormat(d3.format(",d")))
    .attr('transform', `translate(0,${innerHeight})`)

  
  g.selectAll('rect').data(data)
    .enter().append('rect')
      .attr('y', d => yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth());
  
  g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .text(titleText);
};


function wrap(text, w2) {
  text.each(function() {
    let text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text("").append("tspan").attr("x", x).attr("y", 0).attr("dy", dy + "em");
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
    counter += 1;
    d.mount = +d.mount;
  });
  render(data);
});
