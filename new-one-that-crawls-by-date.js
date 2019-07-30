const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

//DONT DO ANYMORE UNTIL I CAN FIGURE OUT HOW TO FUCKING STOP IT 

// had to close out the window so try async/await?  lots of links collected though

// "APPELLATE" out because it doesn't work

const ALL_COUNTIES = ["adair", "alfalfa", "ATOKA", "BEAVER", 'BECKHAM', 'BLAINE', 'BRYAN', 'CADDO', 'CANADIAN', 'CARTER', 'CHEROKEE', 'CHOCTAW', 'CIMARRON', 'CLEVELAND', 'COAL', 'COMANCHE', 'COTTON', 'CRAIG', 'CREEK', 'bristow', 'drumright', 'CUSTER', 'DELAWARE', 'DEWEY', 'ELLIS', 'GARFIELD', 'GARVIN', 'GRADY', 'GRANT', 'GREER', 'HARMON', 'HARPER', 'HASKELL', 'HUGHES', 'JACKSON', 'JEFFERSON', 'JOHNSTON', 'KAY', 'poncacity', 'KINGFISHER', 'KIOWA', 'LATIMER', 'LEFLORE', 'LINCOLN', 'LOGAN', 'LOVE', 'MAJOR', 'MARSHALL', 'MAYES', 'MCCLAIN', 'MCCURTAIN', 'MCINTOSH', 'MURRAY', 'MUSKOGEE', 'NOBLE', 'NOWATA', 'OKFUSKEE', 'OKLAHOMA', 'OKMULGEE', 'OSAGE', 'OTTAWA', 'PAYNE', 'PAWNEE', 'PITTSBURG', 'PONTOTOC', 'POTTAWATOMIE', 'PUSHMATAHA', 'rogermills', 'ROGERS', 'SEMINOLE', 'SEQUOYAH', 'STEPHENS', 'TEXAS', 'TILLMAN', 'TULSA', 'WAGONER', 'WASHINGTON', 'WASHITA', 'WOODS', 'WOODWARD']
// .splice(0,4);

// const DAYS = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];

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
const searchedLinks = [];
const linkQueue = new Set();
const failedLinks = new Set();
let startDate = '3/1/2019';
let masterDate = new Date('04/30/2019');


// ADD BETTER ERRORS THAT WRITE TO A FILE OF FUCKED UP LINKS
// AND A RECURSIVE TIMEOUT THAT DOESNT INCLUDE THE SET

// ADD SOMETHING TO COUNT BY COUNTY
const processResponse = function processResponse($) {
    $('tr').each(function() {   
                        
        let dateTester = new Date($(this).children(':nth-child(2)').text())
        if (dateTester <= masterDate) {
            let title = $(this).children(':nth-child(3)').html().toUpperCase()
            let title2 = $(this).children(':nth-child(3)').html()
            // console.log('title   ' + title)
            if (((title.includes('STATE OF OKLAHOMA V')) || (title.includes('STATE OF OKLAHOMA  V')))) {
                // console.log("tite attr href   " + $(title2).attr('href'))
                let link = `https://www.oscn.net/dockets/` + $(title2).attr('href')
                // console.log(link)
                LINKS.push(link); 
            }
            
        }
    })
  }

const makeURL = function makeURL(urlBase, lastDate) {
    let toDate = new Date(lastDate);
    let newURL = urlBase + (toDate.getMonth() + 1) + `%2F` + toDate.getDate() + `%2F` + toDate.getFullYear();
    // console.log("&&&&&&&    newURL in makeURL " + newURL)
    return newURL;
}

const dateParser = function dateParser(lastDate) {
    console.log('____ made it in the date parser  ')
    // so if dates are 31
    let toDate2 = new Date(lastDate);
    toDate2.setDate(toDate2.getDate() + 1);
    let newDate = (toDate2.getMonth() + 1) + `/` + toDate2.getDate() + `/` + toDate2.getFullYear();
    // console.log('newDATE   ' + newDate)
    return newDate;
}

const getPage = function getPage(urlBase, lastDate) {
    let getPageUrl = makeURL(urlBase, lastDate)
    linkQueue.add(getPageUrl)
    if (!searchedLinks.includes(getPageUrl)) {
        searchedLinks.push(getPageUrl)
    
        // add code to add the link to the searchedLinks
        // and to check to see if its in the array, and if so makeURL(urlBase, dateParser(lastDate))
        console.log("get page url " + getPageUrl)
        request(getPageUrl, 
            { strictSSL: false, 
                headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'}
            }, 
            function (error, response, body) {
                if (!error) {
                    failedLinks.delete(getPageUrl)
                    pageCrawlCount ++;
                    let $ = cheerio.load(body);
                    processResponse($)
                    let newDateText = $('tr td:nth-child(2)').last().text();
                    let newDate = new Date(newDateText);
                    // console.log(newDate)
                    // console.log("does it run " + (newDate <= masterDate))
                    if ((newDate <= masterDate) && ($('tr').length === 501)) { 
                        console.log("made it here, linkQueue= " + linkQueue.size + " and LINKSlength " + LINKS.length)
                        let pleaseSetTimeout2 = setTimeout(function pleaseSetTimeout2() {
                            // console.log("in the timeout ")
                            console.log(" fuuuu  url " + getPageUrl + "  lastDate " + lastDate + " newDate " + newDate);
                            getPage(urlBase, newDateText)
                        }, 1000)
                    }
                    linkQueue.delete(getPageUrl)
                    // can this cause an error since we're not waiting for a response just being sure somethng times out
                } else {
                    console.log("We’ve encountered an error at the docket page: " + error);
                    ERRORS.push(error);
                    try {
                        fs.appendFileSync("links-by-county/failedToCrawl.txt", url + '\n');
                    } catch (err) {
                        console.log('************** somethings up in the writing error')
                        ERRORS.push('there was an error on writing this url  ' + url);
                    }
                    failedLinks.add(urlBase + " " + lastDate)
                    linkQueue.delete(getPageUrl)
                }
            })
    } else {
        getPage(urlBase, dateParser(lastDate))
    }
}

const crawlLinks = function crawlLinks(links,lastDate) {
    links.forEach(function(element, index) {
        let pleaseSetTimeout = setTimeout(function pleaseSetTimeout() {
        // let url = `https://www.oscn.net/dockets/Results.aspx?db=` + element + `&FiledDateL=01%2F01%2F2019`;
        let starter = `https://www.oscn.net/dockets/Results.aspx?db=` + element + `&FiledDateL=`;
        let url = makeURL(starter,lastDate)
        console.log("url   " + url)
        request(url, 
            { strictSSL: false, 
                headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'}
            }, 
            function (error, response, body) {
                if (!error) {
                    pageCrawlCount ++;
                    let $ = cheerio.load(body);

                    $('tr').each(function() {
                        
                        let dateTester = new Date($(this).children(':nth-child(2)').text())
                        if (dateTester <= masterDate) {
                            let title = $(this).children(':nth-child(3)').html().toUpperCase()
                            let title2 = $(this).children(':nth-child(3)').html()
                            // console.log('title   ' + title)
                            if (((title.includes('STATE OF OKLAHOMA V')) || (title.includes('STATE OF OKLAHOMA  V')))) {
                                // console.log("tite attr href   " + $(title2).attr('href'))
                                let link = `https://www.oscn.net/dockets/` + $(title2).attr('href')
                                // console.log(link)
                                LINKS.push(link); 
                            }
                            
                        }
                    })

                    // ignore case

                        
                    let lastDateText = $('tr td:nth-child(2)').last().text();
                    let lastDate = new Date(lastDateText);
                    if ((masterDate >= lastDate) && ($('tr').length === 501)) {
                        let urlBase = `https://www.oscn.net/dockets/Results.aspx?db=` + element + `&FiledDateL=`;
                        getPage(urlBase, lastDateText);
                    }
                    // console.log(url);

                } else {
                    console.log("We’ve encountered an error: " + error);
                    ERRORS.push(error);
                    try {
                        fs.appendFileSync("links-by-county/failedToCrawl.txt", url + '\n');
                    } catch (err) {
                        console.log('************** somethings up in the writing error')
                        ERRORS.push('there was an error on writing this url  ' + url);
                    }
                    failedLinks.add(starter + " " + lastDate)
                }
            }
          );
        }, index * 1500)
    
        } )
}


crawlLinks(ALL_COUNTIES,startDate);
let myGreeting = setTimeout(function sayHi() {
    if (failedLinks.size > 0) {
        console.log('made it to failed link section with failedLinksSize ' + failedLinks.size)
        failedLinks.forEach(function(everything) {
            let parts = everything.split(' ');
            console.log('base url ' + parts[0] + '  end date  ' + parts[1])
            getPageUrl(parts[0],parts[1])
        })
    }
    if (linkQueue.size > 0) {
        console.log("triggered this is shitty linkQueue size is   " + linkQueue.size)
        let newTimer = 140000
        setTimeout(sayHi,newTimer)
    } else {
        distinctLinks = [...new Set(LINKS)];
        console.log("$$$$$$$$$$ distinctLinks:  " + distinctLinks.length);
        distinctLinks.forEach(function(link) {
            linkWritten ++;
            try {
                fs.appendFileSync('links-by-county/PLEASEpleaseMe4.txt', link + '\n');
            } catch (err) {
                console.log('************** somethings up in the writing error')
                ERRORS.push('there was an error on writing this link  ' + link);
            }
        })
        console.log('llllllllllll links written: ' + linkWritten);
    }
    // distinctLinks = [...new Set(LINKS)];
    console.log("**************", "link length:  " + LINKS.length);
    // console.log("$$$$$$$$$$ distinctLinks:  " + distinctLinks.length);
    console.log("ssssssss link count: " +  linkCount);
    console.log("SSSSSSSSSSS pages crawled:" + pageCrawlCount);
    // crawlPage(distinctLinks);
    console.log('ddddddddddd dockets crawled: ' + docketCrawlCount);
    ERRORS.forEach(function(err) {
        console.log(err);
    });
  }, 10000)