const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


let docketCrawlCount = 0;
let loadPageErrors = ['nada'];
let crawlPageErrors = ['none'];
let processTime = 0;
const ERRORS = ['nope'];
let cmidsCrawled = 0;
let linkCounter = 0;

// REMINDERS
// remove the code that takes out last , cause I just decided not to write that comma
// also find a way to add the counties to the data
// and only have one amount and description on it, instead of each county/process time

const loadPage = function loadPage(url, county) {
    // console.log("loadPage " + url + county)
    request(url, 
        { strictSSL: false, 
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'}
        }, 
        function (error, response, body) {

            if (!error) {            
                docketCrawlCount ++;
                let $ = cheerio.load(body);
                const reg = /,/g;
                const reg3 = /\$/g;
                const reg2 = /\n/g;

                // console.log("sup");
                $('tr').each(function () { 
                    if ($(this).find(':nth-child(6)').text()) {
                        let cmid = url.substr(url.lastIndexOf('=') + 1);
                        let first = url.indexOf('db=');
                        let second = url.indexOf('&');
                        let count = url.substring((first + 3), second);
                        let description = $(this).find(':nth-child(3)').text().trim();
                        description = description.replace(reg2, ' ');
                        description = description.replace(reg, ' ');
                        let fee = $(this).find(':nth-child(6)').text().trim();
                        fee = fee.replace(reg3, '');
                        fee = fee.replace(reg, '');
                        fee = fee.trim();
                        let countyFile = 'fees-by-county/PleaseLetThisBeTheLast.txt'; 
                        if ((fee !== 'mount') && (description !== 'Description')) {
                            try {
                                fs.appendFileSync(countyFile, count + ',' + cmid + ',' + description + ',' + fee + '\n');
                            } catch (err) {
                                console.log('************** somethings up in the writing error')
                                ERRORS.push('there was an error on writing this url  ' + url);
                            }
                            
                        }
                        
                    }
                })
                linkCounter--;
            } else {
                console.log("We’ve encountered an error in loadPage: " + error);
                let tempErr = 'error on ' + url + '  error  ' + error;
                loadPageErrors.push(tempErr);
                try {
                    fs.appendFileSync("fees-by-county/failedToCrawl.txt", url + '\n');
                } catch (err) {
                    console.log('************** somethings up in the writing error')
                    ERRORS.push('there was an error on writing this url  ' + url);
                }

                console.log("sfdasd here " + linkCounter)
                linkCounter--;
                console.log("zzzd here " + linkCounter)
            }
        }
      );
}

// const loadPageTimeout = setTimeout(function loadPageTimeout(link, county) {
//     setTimeout(loadPage(link, county), 2000);
// })

const crawlPage = function crawlPage() {
    let county = 'missing';
    // fs.readFile('links-by-county/' + county + '.txt', 'utf8', function (err, data) {
    fs.readFile('links-by-county/PLEASEpleaseMe2.txt', 'utf8', function (err, data) {
        if (!err) {
        const dataArray = data.split(/\r?\n/);
        console.log('docket links to be anaylzed: ' + dataArray.length);
        processTime = dataArray.length * 3050;
        linkCounter = dataArray.length;
        console.log("asdfasdf linkCounter  " + linkCounter)
        dataArray.forEach(function(link, index) {
            let pleaseSetTimeout = setTimeout(function pleaseSetTimeout() {
                // linkCounter++;
                loadPage(link, county);
            }, index * 3000)
        })
        } else {
            console.log('error for crawlPage: ' + err);
            let newErr = 'error writing ' + err;
            crawlPageErrors.push(newErr)
        }
      });
}


crawlPage()

let findTimout = setTimeout(function waiting() {
    let myGreeting = setTimeout(function sayHi() {
        if (linkCounter > 0) {
            console.log("triggered linkCount  is   " + linkCounter)
            let newTimer = linkCounter * 1000
            setTimeout(sayHi,newTimer)
        }
        console.log('ddddddddddd dockets crawled: ' + docketCrawlCount);
        loadPageErrors.forEach(function(err) {
            console.log(err);
        })
        crawlPageErrors.forEach(function(err) {
            console.log(err);
        })
        ERRORS.forEach(function(err) {
            console.log(err);
        });

    }, processTime)
}, 10000)