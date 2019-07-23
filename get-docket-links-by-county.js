const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

//DONT DO ANYMORE UNTIL I CAN FIGURE OUT HOW TO FUCKING STOP IT 

// const ALL_COUNTIES = ["adair", "alfalfa", "APPELLATE", "ATOKA", "BEAVER", 'BECKHAM', 'BLAINE', 'BRYAN', 'CADDO', 'CANADIAN', 'CARTER', 'CHEROKEE', 'CHOCTAW', 'CIMARRON', 'CLEVELAND', 'COAL', 'COMANCHE', 'COTTON', 'CRAIG', 'CREEK', 'bristow', 'drumright', 'CUSTER', 'DELAWARE', 'DEWEY', 'ELLIS', 'GARFIELD', 'GARVIN', 'GRADY', 'GRANT', 'GREER', 'HARMON', 'HARPER', 'HASKELL', 'HUGHES', 'JACKSON', 'JEFFERSON', 'JOHNSTON', 'KAY', 'poncacity', 'KINGFISHER', 'KIOWA', 'LATIMER', 'LEFLORE', 'LINCOLN', 'LOGAN', 'LOVE', 'MAJOR', 'MARSHALL', 'MAYES', 'MCCLAIN', 'MCCURTAIN', 'MCINTOSH', 'MURRAY', 'MUSKOGEE', 'NOBLE', 'NOWATA', 'OKFUSKEE', 'OKLAHOMA', 'OKMULGEE', 'OSAGE', 'OTTAWA', 'PAYNE', 'PAWNEE', 'PITTSBURG', 'PONTOTOC', 'POTTAWATOMIE', 'PUSHMATAHA', 'rogermills', 'ROGERS', 'SEMINOLE', 'SEQUOYAH', 'STEPHENS', 'TEXAS', 'TILLMAN', 'TULSA', 'WAGONER', 'WASHINGTON', 'WASHITA', 'WOODS', 'WOODWARD']
// .splice(0,15);

const ALL_COUNTIES = ["ROGERS"];


console.log(ALL_COUNTIES);
const LINKS = [];
let distinctLinks = [];
let pageCrawlCount = 0;
let linkCount = 0;
let docketCrawlCount = 0;
let linkWritten = 0;

const processResponse = function processResponse($) {
    $('a[href^="GetCaseInformation"]').each(function(index) {
        if ($(this).text().includes('STATE OF OKLAHOMA')) {
            let link = `https://www.oscn.net/dockets/` + $(this).attr('href')
            linkCount ++;
            LINKS.push(link);       
        } 
    })
  }

const makeURL = function makeURL(urlBase, lastDate) {
    let toDate = new Date(lastDate);
    let newURL = urlBase + (toDate.getMonth() + 1) + `%2F` + toDate.getDate() + `%2F2019`;
    return newURL;
}

const getPage = function getPage(urlBase, lastDate) {
    request(makeURL(urlBase, lastDate), 
        { strictSSL: false, 
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'}
        }, 
        function (error, response, body) {
            if (!error) {
                pageCrawlCount ++;
                let $ = cheerio.load(body);
                processResponse($)
                let newDate = new Date($('tr td:nth-child(2)').last().text());
                if ($('tr').length === 501) {
                    getPage(urlBase, newDate)
                }
            } else {
                console.log("We’ve encountered an error at the docket page: " + error);
            }
        })
}

const crawlLinks = function crawlLinks(links) {
    links.forEach(function(element) {
        let url = `https://www.oscn.net/dockets/Results.aspx?db=` + element + `&FiledDateL=01%2F01%2F2019`;
        request(url, 
            { strictSSL: false, 
                headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'}
            }, 
            function (error, response, body) {
                if (!error) {
                    pageCrawlCount ++;
                    let $ = cheerio.load(body);
                    $('a[href^="GetCaseInformation"]').each(function(index) {
                        if ($(this).text().includes('STATE OF OKLAHOMA')) {
                            let link = `https://www.oscn.net/dockets/` + $(this).attr('href')
                            linkCount ++;
                            LINKS.push(link);    
                        } 
                    })
                        
                    let lastDateText = $('tr td:nth-child(2)').last().text();
                    let lastDate = new Date(lastDateText);
                    if ((Date.now() >= lastDate) && ($('tr').length === 501)) {
                        let urlBase = `https://www.oscn.net/dockets/Results.aspx?db=` + element + `&FiledDateL=`;
                        getPage(urlBase, lastDateText);
                    }
                    // console.log(url);

                } else {
                    console.log("We’ve encountered an error: " + error);
                }
            }
          );
    } )
}




crawlLinks(ALL_COUNTIES);
let myGreeting = setTimeout(function sayHi() {
    distinctLinks = [...new Set(LINKS)];
    console.log("**************", "link length:  " + LINKS.length);
    console.log("$$$$$$$$$$ distinctLinks:  " + distinctLinks.length);
    console.log("ssssssss link count: " +  linkCount);
    console.log("SSSSSSSSSSS pages crawled:" + pageCrawlCount);
    // crawlPage(distinctLinks);
    console.log('ddddddddddd dockets crawled: ' + docketCrawlCount);
    distinctLinks.forEach(function(link) {
        linkWritten ++;
        fs.appendFileSync('links-by-county/' + ALL_COUNTIES + '.txt', link + ',' + '\n');
        // works for doing it one at a time but testing wiht test
        // fs.appendFileSync('links-by-county/test.txt', link + ',' + '\n');
    })
    console.log('llllllllllll links written: ' + linkWritten);
    
    
    // let county = element + '.txt'; 
    // fs.appendFileSync('adair.txt', link + ',' + fee + '\n');


  }, 200000)
