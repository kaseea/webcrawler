const fs = require('fs');

let county = 'adair';
    fs.readFile('fees-by-county/' + county + '.txt', 'utf8', function (err, data) {
        if (!err) {
        const dataArray = data.split(/\r?\n/);
        const betterLink = dataArray.map((link) => 
        link.substring(0, link.length - 1)
        );
        const splicedLink = betterLink.splice(0,5);
        console.log('docket links to be anaylzed: ' + splicedLink.length);
        splicedLink.forEach(function(link) {
            console.log(link);
            // setTimeout(loadPage(link, county), 2000);
            let pleaseSetTimeout = setTimeout(function pleaseSetTimeout() {

                console.log('sending loadPage ' + link);
                loadPage(link, county);
            
            }, 1000)
            // loadPage(link, county);
        })
        } else {
            console.log('error for crawlPage: ' + err);
        }
    });