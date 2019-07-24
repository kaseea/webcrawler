const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


let docketCrawlCount = 0;
let loadPageErrors = ['nada'];
let crawlPageErrors = ['none'];
let processTime = 0;
const ERRORS = ['nope'];

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
                        // let countyFile = 'fees-by-county/' + county + '.txt'; 
                        let countyFile = 'fees-by-county/testWithoutComma.txt'; 
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
            } else {
                console.log("We’ve encountered an error in loadPage: " + error);
                let tempErr = 'error on ' + url + '  error  ' + error;
                loadPageErrors.push(tempErr);
            }
        }
      );
}

// const loadPageTimeout = setTimeout(function loadPageTimeout(link, county) {
//     setTimeout(loadPage(link, county), 2000);
// })

const crawlPage = function crawlPage() {
    let county = 'total';
    fs.readFile('links-by-county/' + county + '.txt', 'utf8', function (err, data) {
        if (!err) {
        const dataArray = data.split(/\r?\n/);
        console.log('docket links to be anaylzed: ' + dataArray.length);
        processTime = dataArray.length * 101;
        // let tempArray = dataArray.splice(0,1500);
        // processTime = tempArray.length * 101;
        // console.log('docket links to be anaylzed: ' + tempArray.length)
        dataArray.forEach(function(link, index) {
        // tempArray.forEach(function(link, index) {
            // console.log(link);
            // console.log(index);
            let pleaseSetTimeout = setTimeout(function pleaseSetTimeout() {

                // console.log('sending loadPage ' + link);
                loadPage(link, county);
                // console.log('index in timeout   ' + index);
            
            }, index * 100)
            // loadPage(link, county);
        })
        } else {
            console.log('error for crawlPage: ' + err);
            let newErr = 'error writing ' + err;
            crawlPageErrors.push(newErr)
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

let findTimout = setTimeout(function waiting() {
    let myGreeting = setTimeout(function sayHi() {
        // crawlPage(distinctLinks);
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