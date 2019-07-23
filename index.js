// const fs = require('fs');

// const DATA = {};

const DATA = {
'COURT COSTS ON MISDEMEANOR': 415,
'DA COUNCIL PROSECUTION ASSESSMENT FOR MISDEMEANOR': 180,
'OKLAHOMA COURT INFORMATION SYSTEM REVOLVING FUND': 150,
'MEDICAL EXPENSE LIABILITY REVOLVING FUND': 60,
'TRAUMA CARE ASSISTANCE REVOLVING FUND': 250,
'AFIS FEE': 60,
'CLEET PENALTY ASSESSMENT': 60,
'FORENSIC SCIENCE IMPROVEMENT ASSESSMENT': 60,
'SHERIFF’S SERVICE FEE FOR COURT HOUSE SECURITY': 60,
'FINES PAYABLE TO COUNTY GENERAL FUND': 12.5,
'LAW LIBRARY FEE':36
}

// const dataCollection = function dataCollection() {
//     let county = 'adair';
//     fs.readFile('fees-by-county/' + county + '.txt', 'utf8', function (err, data) {
//         if (!err) {
//         const dataArray = data.split(/\r?\n/);
//         // let headers = dataArray[0].split(',');
//         const betterLink = dataArray.map((link) => 
//            link.substring(0, link.length - 1)
//         );
//         // const splicedLink = betterLink.splice(0,5);
//         console.log('made it here');
//         betterLink.forEach(function(line) {
//             // console.log(line);
//             let info = line.split(',');
//             let fee = parseFloat(info[2], 10);
//             if (DATA.hasOwnProperty(info[1])) {
//                 DATA[info[1]] += fee;
//                 console.log('we found a repeat  ' + info[1])
//             } else {
//                 console.log('were adding a new thing')
//                 DATA[info[1]] = fee;
//             }
            
//         })
//         } else {
//             console.log('error for crawlPage: ' + err);
//         }
//       });

// console.log('end data equals   ' + DATA);
// }

// dataCollection();

// let myGreeting = setTimeout(function sayHi() {
    // crawlPage(distinctLinks);
    // console.log('end data equals   ' + DATA);
//     Object.keys(DATA).forEach(function (item) {
//         // console.log(item); // key
//         // console.log(DATA[item]); // value
//     })
//     const x = d3.scale.linear()
//     .domain([0, d3.max(Object.values(DATA))])
//     .range([0, 420]);

// d3.select(".chart")
//   .selectAll("div")
//     .data(Object.values(DATA))
//     // .data(DATA);
//   .enter().append("div")
//     .style("width", function(d) { console.log('the style xd    ' + x(d)); return x(d) + "px"; })
    
//     .text(function(d) { console.log('the d in text    ' + d); return d; });

//   }, 3000)

// let width = 420,
//     barHeight = 20;

// let x = d3.scale.linear()
//     .domain([0, d3.max(Object.values(DATA))])
//     .range([0, width]);

// let chart = d3.select(".chart")
//     .attr("width", width)
//     .attr("height", barHeight * Object.values(DATA).length);

// let bar = chart.selectAll("g")
//     .data(Object.values(DATA))
//   .enter().append("g")
//     .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

// bar.append("rect")
//     .attr("width", x)
//     .attr("height", barHeight - 1);

// bar.append("text")
//     .attr("x", function(d) { return x(d) - 3; })
//     .attr("y", barHeight / 2)
//     .attr("dy", ".35em")
//     .text(function(d) { return d; });

var width = 1020,
    barHeight = 40;

var x = d3.scale.linear()
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width);

    d3.csv("/sums-fees-by-county/adair.txt", type, function(error, data) {
      console.log("heeeey23");
      // console.log('data   ' + data);
      x.domain([0, d3.max(data, function(d) { 
        
        console.log('d escription   ' + d.Description); return d.mount; })]);
    
      console.log('data length  ' + data.length);
      chart.attr("height", barHeight * data.length);

      // const textstuff = names.selectAll("p")
    
      var bar = chart.selectAll("g")
          .data(data)
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
    
      bar.append("rect")
          .attr("width", function(d) { return x(d.mount); })
          .attr("height", barHeight - 1);
    
      bar.append("text")
          // .attr("x", function(d) { return x(d.mount) - 3; })
          .attr("x", 100)
          .attr("y", barHeight / 2)
          .attr("dy", ".35em")
          .text(function(d) { return `${d.Description}  ${d.mount}`; });
    });
    
    function type(d) {
      // console.log('trying to force into a value d ' + d + 'd.value ' + d.mount);
      d.mount = +d.mount; // coerce to number
      return d;
    }