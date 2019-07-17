const fs = require('fs');

const DATA = {}

const dataCollection = function dataCollection() {
    let county = 'adair';
    fs.readFile('fees-by-county/' + county + '.txt', 'utf8', function (err, data) {
        if (!err) {
        const dataArray = data.split(/\r?\n/);
        // let headers = dataArray[0].split(',');
        const betterLink = dataArray.map((link) => 
           link.substring(0, link.length - 1)
        );
        // const splicedLink = betterLink.splice(0,5);
        console.log('made it here');
        betterLink.forEach(function(line) {
            // console.log(line);
            let info = line.split(',');
            let fee = parseFloat(info[2], 10);
            if (DATA.hasOwnProperty(info[1])) {
                DATA[info[1]] += fee;
                console.log('we found a repeat  ' + info[1])
            } else {
                console.log('were adding a new thing')
                DATA[info[1]] = fee;
            }
            
        })
        } else {
            console.log('error for crawlPage: ' + err);
        }
      });

}





dataCollection();


let myGreeting = setTimeout(function sayHi() {
    console.log('end data equals   ' + DATA);
    Object.keys(DATA).forEach(function (item) {
        console.log(item); // key
        console.log(DATA[item]); // value
        console.log(typeof DATA[item]);
        console.log('Number.isInteger(DATA[item])   ' + Number.isInteger(DATA[item]));
        console.log('(DATA[item]) != (DATA[item])  ' + ((DATA[item]) === (DATA[item])));
        console.log(Number.isInteger(DATA[item]) && ((DATA[item]) === (DATA[item])));

        if (Number.isInteger(DATA[item]) && ((DATA[item]) === (DATA[item]))) {
            fs.appendFileSync('sums-fees-by-county/adair.txt', item + ',' + DATA[item] + '\n');
        }
    })
    // fs.appendFileSync('links-by-county/adair.txt', link + ',' + '\n');
}, 10000);