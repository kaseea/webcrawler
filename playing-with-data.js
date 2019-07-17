const fs = require('fs');

const startingParse = function startingParse() {
let county = 'adair';
    fs.readFile('fees-by-county/' + county + '.txt', 'utf8', function (err, data) {
        if (!err) {
        const dataArray = data.split(/\r?\n/);
        const betterLink = dataArray.map((link) => 
        link.substring(0, link.length - 1)
        );
        const splicedLink = betterLink.splice(0,5);
        console.log('docket links to be anaylzed: ' + splicedLink.length);
        } else {
            console.log('error for crawlPage: ' + err);
        }
    });
}