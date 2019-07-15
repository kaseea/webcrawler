const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


let docketCrawlCount = 0;

const loadPage = function loadPage(url, county) {
    request(url, 
        { strictSSL: false, 
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'}
        }, 
        function (error, response, body) {
            if (!error) {
                docketCrawlCount ++;
                let $ = cheerio.load(body);
                // console.log("sup");
                $('tr').each(function (index) { 
                    if ($(this).find(':nth-child(6)').text()) {
                        let description = $(this).find(':nth-child(3)').text();
                        let fee = $(this).find(':nth-child(6)').text();
                        fee = fee.substring(1, fee.length)
                        let countyFile = 'fees-by-county/' + county + '.txt'; 
                        fs.appendFileSync(countyFile, description + ',' + fee + '\n');
                    }
                })
            } else {
                console.log("We’ve encountered an error in loadPage: " + error);
            }
        }
      );
}


const crawlPage = function crawlPage() {
    let county = 'adair';
    fs.readFile('links-by-county/' + county + '.txt', 'utf8', function (err, data) {
        if (!err) {
        const dataArray = data.split(/\r?\n/);
        const betterLink = dataArray.map((link) => 
           link.substring(0, link.length - 1)
        );
        const splicedLink = betterLink.splice(0,20);
        console.log('docket links to be anaylzed: ' + splicedLink.length);
        splicedLink.forEach(function(link) {
            setTimeout(loadPage(link, county), 2000)
        })
        } else {
            console.log('error for crawlPage: ' + err);
        }
      });
    // txtFile.forEach(function(link) {
        // setTimeout(loadPage(link, element), 2000);
        
    // })
}


crawlPage()
// function myFunction() {
//     // your code to run after the timeout
// }

// // stop for sometime if needed
// setTimeout(myFunction, 5000);


let myGreeting = setTimeout(function sayHi() {
    // crawlPage(distinctLinks);
    console.log('ddddddddddd dockets crawled: ' + docketCrawlCount);

  }, 100000)