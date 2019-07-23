const fs = require('fs');

const DATA = {};
// const sorted=[];

const errors = {'err': 'so far just this',  
                'err2': ''}


let county = 'ROGERS';

const dataCollection = function dataCollection() {
    fs.readFile('fees-by-county/' + county + '.txt', 'utf8', function (err, data) {
        if (!err) {
        const dataArray = data.split(/\r?\n/);
        // let headers = dataArray[0].split(',');
        const betterLink = dataArray.map((link) => 
           link.substring(0, link.length - 1)
        );
        // const splicedLink = betterLink.splice(0,5);
        console.log('made it here');
        betterLink.forEach(function(line, index) {
            // console.log(line);
            let info = line.split(',');
            // console.log('  this is the description  ' + info[1]);
            // console.log('pre parsing ' + info[2]);
            let fee = parseFloat(info[2], 10);
            // console.log('after parsing ' + fee);
            // console.log('index is ' + index + '    description is ' + info[1] + '   the fee is  ' + fee);
            const reg = /\*/g;
            // const pattern = /Document/;
            
            if (info[1] !== undefined) {
                if (info[1].includes('Document')) {
                    let i = info[1].indexOf('Document');
                    // console.log(info[1]);
                    // let i = pattern.match(info[1]);
                    info[1] = info[1].substring(0, i -1);
                    info[1] = info[1].trim();
                } 
                if (info[1].includes('Pursuant')) {
                    // console.log(info[1]);
                    let j = info[1].indexOf('Pursuant');
                    // let i = pattern.match(info[1]);
                    info[1] = info[1].substring(0, j -1);
                    info[1] = info[1].trim();
                }
                info[1] = info[1].replace(reg, '');
                
                if (info[1].includes('WARRANT')) {
                    info[1] = 'WARRANT FEE';
                // } else if (info[1].includes('WARRANT OF ARREST ISSUED')) {
                //     info[1] = 'WARRANT OF ARREST ISSUED';
                } else if (info[1].includes('ARREST FEE') || info[1].includes('SHERIFF\'S FEE') || info[1].includes('SHERIFF FEE') || info[1].includes('SHERIFF SERVICE')) {
                    info[1] = 'SHERIFF SERVICE FEE ACCOUNT';
                } else if (info[1].includes('FORENSIC')) {
                    info[1] = 'FORENSIC SCIENCE IMPROVEMENT ASSESSMENT FUND';
                } else if (info[1].includes('RESTITUTION PAID TO')) {
                    info[1] = 'RESTITUTION PAID TO';
                } else if (info[1].includes('BOND')) {
                    info[1] =  'BOND FEE';
                } else if (info[1].includes('SHERIFF\'S FUND - INMATE JAIL COSTS') || (info[1].includes('INCARCERATION')) || (info[1].includes('INMATE BILLING')) || (info[1].includes('JAIL'))) {
                    info[1] = 'INMATE JAIL COSTS'
                } else if (info[1].includes('SUBPOENA') || info[1].includes('SUBPEONA')) {
                    info[1] = 'SUBPOENA SERVED';
                } else if (info[1].includes('APPLICATION AND ORDER FOR APPOINTED COUNSEL') || info[1].includes('APPLICATION FOR APPOINTED COUNSEL')) {
                    info[1] = 'APPLICATION AND ORDER FOR APPOINTED COUNSEL';
                } else if (info[1].includes('VICTIMS COMPENSATION ASSESSMENT') || (info[1].includes('VICTIM\'S SERVICES UNIT'))) {
                    info[1] = 'VICTIMS COMPENSATION ASSESSMENT';
                } else if (info[1].includes('SECURITY')) {
                    info[1] = 'COURTHOUSE SECURITY FEE';
                } else if (info[1].includes('DA DRUG') || info[1].includes('DISTRICT ATTORNEY DRUG ASSESSMENT')) {
                    info[1] = 'DA DRUG FUND';
                } else if (info[1].includes('FINES PAYABLE TO COUNTY')) {
                    info[1] = 'FINES PAYABLE TO COUNTY';
                } else if (info[1].includes('COURT FUND ASSESSMENT')) {
                    info[1] = 'COURT FUND ASSESSMENT';
                } else if (info[1].includes('GARNISHMENT')) {
                    info[1] = 'GARNISHMENT';
                } else if ((info[1].includes('INDIGENT DEFENSE'))  || (info[1].includes('OIDS'))) {
                    info[1] = 'INDIGENT DEFENSE';
                } else if (info[1].includes('VERIFICATION OF INCARCERATION FEES')) {
                    info[1] = 'VERIFICATION OF INCARCERATION FEES';
                } else if (info[1].includes('APPLICATION FOR STATE TAX ENFORCEMENT')) {
                    info[1] = 'APPLICATION FOR STATE TAX ENFORCEMENT';
                } else if (info[1].includes('PETITION')) {
                    info[1] = 'PETITION';
                } else if (info[1].includes('DA RECOMMENDATION') || (info[1].includes('DA RECOMENDATION'))) {
                    info[1] = 'FINE IMPOSED BY DA RECOMMENDATION';
                } else if (info[1].includes('DOCKET FEE')) {
                    info[1] = 'DOCKET FEE';
                } else if ((info[1].includes('C.L.E.E.T.')) || (info[1].includes('CLEET'))) {
                    info[1] = 'CLEET';
                } else if ((info[1].includes('COURT INFORMATION SYSTEM')) || (info[1].includes('OCIS')) || (info[1].includes('COURT INFO SYSTEM'))) {
                    info[1] = 'OKLAHOMA COURT INFORMATION SYSTEM FEE';
                } else if (info[1].includes('PLEA')) {
                    info[1] = 'PLEA FEE';
                } else if (info[1].includes('SUMMON')) {
                    info[1] = 'SUMMONS STUFF';
                } else if (info[1].includes('POWER NUMBER')) {
                    info[1] = 'POWER NUMBER';
                } else if (info[1].includes('AFIS') || info[1].includes('A.F.I.S') || info[1].includes('FINGER')) {
                    info[1] = 'AUTOMATED FINGERPRINT IDENTIFICATION SYSTEM';
                } else if (info[1].includes('LAW LIBRARY')) {
                    info[1] = 'LAW LIBRARY FEE';
                } else if (info[1].includes('TCA') || info[1].includes('TRAUMA') || info[1].includes('TCRF')) {
                    info[1] = 'TRAUMA CARE REVOLVING FUND'
                } else if (info[1].includes('VCA') || info[1].includes('VICTIM')) {
                    info[1] = 'VICTIM COMPENSATION ASSESSMENT'
                } else if (info[1].includes('CAMA') || info[1].includes('CHAB') || info[1].includes('CHILD ABUSE')) {
                    info[1] = 'CHILD ABUSE MULTIDISCIPLINARY FEE'
                } else if (info[1].includes('POWER NUMBER')) {
                    info[1] = 'POWER NUMBER';
                } else if (info[1].includes('OSBI') || info[1].includes('OSBX')) {
                    info[1] = 'OKLAHOMA STATE BUREAU OF INVESTIGATION';
                } else if (info[1].includes('DARF') || info[1].includes('DA REV') || info[1].includes('D.A. REV') || info[1].includes('DISTRICT ATTY REV') || info[1].includes('DISTRICT ATTORNEY\'S REV') || info[1].includes('DISTRICT ATTORNEY FEE') || info[1].includes('DISTRICT ATTORNEY REV') || info[1].includes('DISTRICT ATTORNEY COUNCIL REV')) {
                    info[1] = 'DISTRICT ATTORNEY REVOLVING FUND';
                } else if (info[1].includes('FILE') && info[1].includes('ENTER')) {
                    info[1] = 'FILE AND ENTER FEE';
                } else if (info[1].includes('DPS') || info[1].includes('D.P.S') || info[1].includes('DEPARTMENT OF PUBLIC SAFETY') || info[1].includes('DEPT OF PUBLIC') || info[1].includes('DEPART. OF PUBLIC') || info[1].includes('DEPT. OF PUBLIC')  || info[1].includes('DEPT PUBLIC SAFETY')) {
                    info[1] = 'DPS PATROL VEHICLE REVOLVING FUND';
                } else if ((info[1].includes('MEDICAL') && !info[1].includes('REIMBURSEMENT')) || info[1].includes('MLRF')) {
                    info[1] = 'MEDICAL EXPENSE LIABILITY REVOLVING FUND';
                } else if (info[1].includes('COURT FUND')) {
                    info[1] = 'COURT FUND';
                } else if (info[1].includes('10%') || info[1].includes('COURT CLERK') || info[1].includes('CLERK\'S FEE')) {   
                    // console.log(info[1]);
                    info[1] = 'COURT CLERK REVOLVING FUND';
                    // console.log(info[1]);
                    // console.log(fee);
                }
                // OH FUCK WHY ISNT THIS WORKING
                
                // console.log('$$$$$$$$$$ DOES fee > 0 ' + (fee > 0))
                if (fee > 0) {

                    if (DATA.hasOwnProperty(info[1])) {
                        let holder = info[1];
                        // console.log('were adding a repeat    key ' + holder + '    value  ' + fee)
                        DATA[holder] += fee;
                        // console.log(' and DATA[holder] is    ' + DATA[holder])
                        // console.log('we found a repeat  ' + info[1])
                    } else {
                        let holder2 = info[1];
                        // console.log('were adding a new thing    key ' + holder2 + '    value  ' + fee)
                        
                        DATA[holder2] = fee;
                        // console.log(' and DATA[holder] is    ' + DATA[holder2])
                    }
                }
                // console.log('**********');

            }
        })
        } else {
            console.log('error for sumPage: ' + err);
            errors['err'] = 'there was an error parsing the project'
            
        }
      });

}





dataCollection();
// function sorting(obj) {
// 	for(let key in obj)
// 		if (obj.hasOwnProperty(key)) {
// 			sorted.push([key, obj[key]]); // each item is an array in format [key, value]
//         }
//         sorted.sort(function(a, b) {
//             return a[1]-b[1]; // compare numbers
//         });
//         return sorted;
// }

let myGreeting = setTimeout(function sayHi() {
    console.log('$$$ COUNTY   IS    ' + county);

    // sorting(DATA);
	// sort items by value

	// return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
    // console.log('end data equals   ' + DATA);
    Object.keys(DATA).forEach(function (item) {
        // sorted.forEach(function (item) {
        // console.log(item); // key
        // console.log(DATA[item]); // value
        // console.log(typeof DATA[item]);
        // console.log('Number.isInteger(DATA[item])   ' + Number.isInteger(DATA[item]));
        // console.log('(DATA[item]) != (DATA[item])  ' + ((DATA[item]) === (DATA[item])));
        // console.log(Number.isInteger(DATA[item]) && ((DATA[item]) === (DATA[item])));

        // && ((DATA[item]) >= 100)
        if ((typeof DATA[item] === 'number') && ((DATA[item]) === (DATA[item])) && ((DATA[item]) >= 1000)) {
            console.log((typeof DATA[item] === 'number') && ((DATA[item]) === (DATA[item])) && ((DATA[item]) >= 1000))
            try {
                fs.appendFileSync('sums-fees-by-county/' + county + '.txt', item + ',' + DATA[item] + '\n');
            } catch (err) {
                console.log('************** somethings up in the writing error')
                errors['err2'] += 'there was an error on writing sums by county  ' + item + ',' + DATA[item];
            }
        } 
    })
    console.log('errors for the reading thing      ' + errors['err']);
    console.log('errors for the writing to new fils    ' + errors['err2']);

    // probably should have an error here if it doesn't write

    // fs.appendFileSync('links-by-county/adair.txt', link + ',' + '\n');
}, 20000);