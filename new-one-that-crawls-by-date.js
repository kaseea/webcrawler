const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

//DONT DO ANYMORE UNTIL I CAN FIGURE OUT HOW TO FUCKING STOP IT 

// had to close out the window so try async/await?  lots of links collected though

// "APPELLATE" out because it doesn't work

const ALL_COUNTIES = ["adair", "alfalfa", "ATOKA", "BEAVER", 'BECKHAM', 'BLAINE', 'BRYAN', 'CADDO', 'CANADIAN', 'CARTER', 'CHEROKEE', 'CHOCTAW', 'CIMARRON', 'CLEVELAND', 'COAL', 'COMANCHE', 'COTTON', 'CRAIG', 'CREEK', 'bristow', 'drumright', 'CUSTER', 'DELAWARE', 'DEWEY', 'ELLIS', 'GARFIELD', 'GARVIN', 'GRADY', 'GRANT', 'GREER', 'HARMON', 'HARPER', 'HASKELL', 'HUGHES', 'JACKSON', 'JEFFERSON', 'JOHNSTON', 'KAY', 'poncacity', 'KINGFISHER', 'KIOWA', 'LATIMER', 'LEFLORE', 'LINCOLN', 'LOGAN', 'LOVE', 'MAJOR', 'MARSHALL', 'MAYES', 'MCCLAIN', 'MCCURTAIN', 'MCINTOSH', 'MURRAY', 'MUSKOGEE', 'NOBLE', 'NOWATA', 'OKFUSKEE', 'OKLAHOMA', 'OKMULGEE', 'OSAGE', 'OTTAWA', 'PAYNE', 'PAWNEE', 'PITTSBURG', 'PONTOTOC', 'POTTAWATOMIE', 'PUSHMATAHA', 'rogermills', 'ROGERS', 'SEMINOLE', 'SEQUOYAH', 'STEPHENS', 'TEXAS', 'TILLMAN', 'TULSA', 'WAGONER', 'WASHINGTON', 'WASHITA', 'WOODS', 'WOODWARD']
// .splice(0,15);

const DAYS = 

// const ALL_COUNTIES = ["Harper","Harmon","Coal","Garvin","Pontotoc","Johnston","Kingfisher","LeFlore","RogerMills"];
const ERRORS = [];
// const ALL_COUNTIES = ["bryan"];


// console.log(ALL_COUNTIES);
const LINKS = [];
let distinctLinks = [];
let pageCrawlCount = 0;
let linkCount = 0;
let docketCrawlCount = 0;
let linkWritten = 0;
const linkQueue = [];
let linkQueueCounter = 0;




// ADD SOMETHING TO COUNT BY COUNTY
const processResponse = function processResponse($) {
    $('a[href^="GetCaseInformation"]').each(function() {
        let title = $(this).text().toUpperCase();
        if ((title.includes('STATE OF OKLAHOMA V')) || (title.includes('STATE OF OKLAHOMA  V'))) {
            let link = `https://www.oscn.net/dockets/` + $(this).attr('href')
            linkCount ++;
            LINKS.push(link);  
            console.log("processing")
            // try {
            //     fs.appendFileSync('links-by-county/FINALLLLL.txt', link + '\n');
            // } catch (err) {
            //     console.log('************** somethings up in the writing error')
            //     ERRORS.push('there was an error on writing this link  ' + link);
            // }     
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
                    linkQueueCounter++;
                    if (linkQueueCounter > 0) { 
                        console.log("made it here, linkQueueCounter= " + linkQueueCounter + " and LINKSlength " + LINKS.length)
                        let pleaseSetTimeout2 = setTimeout(function pleaseSetTimeout2() {
                            console.log("in the timeout ")
                            getPage(urlBase, newDate)
                        }, 1000)
                    }
                    linkQueueCounter--;
                }
            } else {
                console.log("We’ve encountered an error at the docket page: " + error);
                ERRORS.push(error);
            }
        })
}

const crawlLinks = function crawlLinks(links) {
    links.forEach(function(element, index) {
        let pleaseSetTimeout = setTimeout(function pleaseSetTimeout() {

        let url = `https://www.oscn.net/dockets/Results.aspx?db=` + element + `&FiledDateL=01%2F01%2F2019`;
        request(url, 
            { strictSSL: false, 
                headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'}
            }, 
            function (error, response, body) {
                if (!error) {
                    pageCrawlCount ++;
                    let $ = cheerio.load(body);
                    // ignore case
                    $('a[href^="GetCaseInformation"]').each(function() {
                        let title = $(this).text().toUpperCase();
                        if (title.includes('STATE OF OKLAHOMA V')) {
                            let link = `https://www.oscn.net/dockets/` + $(this).attr('href')
                            linkCount ++;
                            LINKS.push(link);    
                            // try {
                            //     fs.appendFileSync('links-by-county/FINALLLLL.txt', link + '\n');
                            // } catch (err) {
                            //     console.log('************** somethings up in the writing error')
                            //     ERRORS.push('there was an error on writing this link  ' + link);
                            // }
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
                    ERRORS.push(error);
                }
            }
          );
        }, index * 500)
    
        } )
}



// if I run everything at once, should be ok, I hope, don't need the county for a file, just call it total
// and then the set will take care of everything
// maybe add something to have a count of links by county



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
        try {
            // fs.appendFileSync('links-by-county/' + ALL_COUNTIES + '.txt', link + ',' + '\n');
        // works for doing it one at a time but testing wiht test
        fs.appendFileSync('links-by-county/FINALLLLLL.txt', link + '\n');
        } catch (err) {
            console.log('************** somethings up in the writing error')
            ERRORS.push('there was an error on writing this link  ' + link);
        }
    })
    console.log('llllllllllll links written: ' + linkWritten);
    ERRORS.forEach(function(err) {
        console.log(err);
    });
    
    // let county = element + '.txt'; 
    // fs.appendFileSync('adair.txt', link + ',' + fee + '\n');


  }, 6000000)