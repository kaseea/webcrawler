const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


let docketCrawlCount = 0;

const loadPage = function loadPage(url) {
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
                        let county = element + '.txt'; 
                        fs.appendFileSync(county, description + ',' + fee + '\n');
                    }
                })
            } else {
                console.log("We’ve encountered an error: " + error);
            }
        }
      );
}
const crawlPage = function crawlPage(pages) {
    pages.forEach(function(element) {
        let url = `https://www.oscn.net/dockets/` + element;

    })
}

function myFunction() {
    // your code to run after the timeout
}

// stop for sometime if needed
setTimeout(myFunction, 5000);