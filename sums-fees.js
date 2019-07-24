const fs = require('fs');

const DATA = {};
let allFees = 0;
// const sorted=[];

// count how many are there per counties
// count how many things aren't written

// appellate doesn't have anything, or, its set up as v. state of oklahoma but can't find anything with fines
// CHECK TO SEE IF I TIMED EVERYTHING BY 100 to decide later

const errors = {'err': 'so far just this',  
                'err2': ''}

const counties = {};

let county = 'testWithoutComma';

const dataCollection = function dataCollection() {
    fs.readFile('fees-by-county/' + county + '.txt', 'utf8', function (err, data) {
        if (!err) {
        const dataArray = data.split(/\r?\n/);
        const betterLink = dataArray.map((link) => 
           link.substring(0, link.length - 1)
        );
        console.log('made it here');
        betterLink.forEach(function(line, index) {
            let info = line.split(',');
            let fee = parseFloat(info[3], 10);
            fee = fee * 100;
            fee = parseInt(fee, 10);
            const reg = /\*/g;
            let cmid = parseInt(info[1], 10);
            if ((typeof fee !== 'number') && (!Number.isNaN(fee))) {
                    fee = 0;
            }

            if (fee > 0){
                if (counties.hasOwnProperty(info[0])) {
                    allFees += fee;
                    counties[info[0]].feesCount += 1;
                    counties[info[0]].feeTotal += fee;
                    counties[info[0]].cmids.add(cmid);
                } else {
                    // if (info[0] !== '') {
                        allFees += fee;
                        counties[info[0]] = { feesCount: 1,
                                                feeTotal: fee,
                                                cmids: new Set([cmid])
                                            };
                    // }
                }  

            }   
            if (info[2] !== undefined) {
                if (info[2].includes('Document')) {
                    let i = info[2].indexOf('Document');
                    info[2] = info[2].substring(0, i -1);
                    info[2] = info[2].trim();
                } 
                if (info[2].includes('Pursuant')) {
                    let j = info[2].indexOf('Pursuant');
                    info[2] = info[2].substring(0, j -1);
                    info[2] = info[2].trim();
                }
                info[2] = info[2].replace(reg, '');
                
                if (info[2].includes('WARRANT')) {
                    info[2] = 'WARRANT FEE';
                } else if (info[2].includes('ARREST FEE') || info[2].includes('SHERIFF\'S FEE') || info[2].includes('SHERIFF FEE') || info[2].includes('SHERIFF SERVICE')) {
                    info[2] = 'SHERIFF SERVICE FEE ACCOUNT';
                } else if (info[2].includes('FORENSIC')) {
                    info[2] = 'FORENSIC SCIENCE IMPROVEMENT ASSESSMENT FUND';
                } else if (info[2].includes('RESTITUTION PAID TO')) {
                    info[2] = 'RESTITUTION PAID TO';
                } else if (info[2].includes('BOND')) {
                    info[2] =  'BOND FEE';
                } else if (info[2].includes('SHERIFF\'S FUND - INMATE JAIL COSTS') || (info[2].includes('INCARCERATION')) || (info[2].includes('INMATE BILLING')) || (info[2].includes('JAIL'))) {
                    info[2] = 'INMATE JAIL COSTS'
                } else if (info[2].includes('SUBPOENA') || info[2].includes('SUBPEONA')) {
                    info[2] = 'SUBPOENA SERVED';
                } else if (info[2].includes('APPLICATION AND ORDER FOR APPOINTED COUNSEL') || info[2].includes('APPLICATION FOR APPOINTED COUNSEL')) {
                    info[2] = 'APPLICATION AND ORDER FOR APPOINTED COUNSEL';
                } else if (info[2].includes('VICTIMS COMPENSATION ASSESSMENT') || (info[2].includes('VICTIM\'S SERVICES UNIT'))) {
                    info[2] = 'VICTIM COMPENSATION ASSESSMENT';
                } else if (info[2].includes('SECURITY')) {
                    info[2] = 'COURTHOUSE SECURITY FEE';
                } else if (info[2].includes('DA DRUG') || info[2].includes('DISTRICT ATTORNEY DRUG ASSESSMENT')) {
                    info[2] = 'DA DRUG FUND';
                } else if (info[2].includes('FINES PAYABLE TO COUNTY')) {
                    info[2] = 'FINES PAYABLE TO COUNTY';
                } else if (info[2].includes('COURT FUND ASSESSMENT')) {
                    info[2] = 'COURT FUND ASSESSMENT';
                } else if (info[2].includes('GARNISHMENT')) {
                    info[2] = 'GARNISHMENT';
                } else if ((info[2].includes('INDIGENT DEFENSE'))  || (info[2].includes('OIDS'))) {
                    info[2] = 'INDIGENT DEFENSE';
                } else if (info[2].includes('VERIFICATION OF INCARCERATION FEES')) {
                    info[2] = 'VERIFICATION OF INCARCERATION FEES';
                } else if (info[2].includes('APPLICATION FOR STATE TAX ENFORCEMENT')) {
                    info[2] = 'APPLICATION FOR STATE TAX ENFORCEMENT';
                } else if (info[2].includes('PETITION')) {
                    info[2] = 'PETITION';
                } else if (info[2].includes('DA RECOMMENDATION') || (info[2].includes('DA RECOMENDATION'))) {
                    info[2] = 'FINE IMPOSED BY DA RECOMMENDATION';
                } else if (info[2].includes('DOCKET FEE')) {
                    info[2] = 'DOCKET FEE';
                } else if ((info[2].includes('C.L.E.E.T.')) || (info[2].includes('CLEET'))) {
                    info[2] = 'CLEET';
                } else if ((info[2].includes('COURT INFORMATION SYSTEM')) || (info[2].includes('OCIS')) || (info[2].includes('COURT INFO SYSTEM'))) {
                    info[2] = 'OKLAHOMA COURT INFORMATION SYSTEM FEE';
                } else if (info[2].includes('PLEA')) {
                    info[2] = 'PLEA FEE';
                } else if (info[2].includes('SUMMON')) {
                    info[2] = 'SUMMONS STUFF';
                } else if (info[2].includes('POWER NUMBER')) {
                    info[2] = 'POWER NUMBER';
                } else if (info[2].includes('AFIS') || info[2].includes('A.F.I.S') || info[2].includes('FINGER')) {
                    info[2] = 'AUTOMATED FINGERPRINT IDENTIFICATION SYSTEM';
                } else if (info[2].includes('LAW LIBRARY')) {
                    info[2] = 'LAW LIBRARY FEE';
                } else if (info[2].includes('TCA') || info[2].includes('TRAUMA') || info[2].includes('TCRF')) {
                    info[2] = 'TRAUMA CARE REVOLVING FUND'
                } else if (info[2].includes('VCA') || info[2].includes('VICTIM')) {
                    info[2] = 'VICTIM COMPENSATION ASSESSMENT'
                } else if (info[2].includes('CAMA') || info[2].includes('CHAB') || info[2].includes('CHILD ABUSE') || info[2].includes('C.H.A.B')) {
                    info[2] = 'CHILD ABUSE MULTIDISCIPLINARY FEE'
                } else if (info[2].includes('POWER NUMBER')) {
                    info[2] = 'POWER NUMBER';
                } else if (info[2].includes('OSBI') || info[2].includes('OSBX')) {
                    info[2] = 'OKLAHOMA STATE BUREAU OF INVESTIGATION';
                } else if (info[2].includes('DARF') || info[2].includes('DA REV') || info[2].includes('D.A. REV') || info[2].includes('DISTRICT ATTY REV') || info[2].includes('DISTRICT ATTORNEY\'S REV') || info[2].includes('DISTRICT ATTORNEY FEE') || info[2].includes('DISTRICT ATTORNEY REV') || info[2].includes('DISTRICT ATTORNEY COUNCIL REV')) {
                    info[2] = 'DISTRICT ATTORNEY REVOLVING FUND';
                } else if (info[2].includes('FILE') && info[2].includes('ENTER')) {
                    info[2] = 'FILE AND ENTER FEE';
                } else if (info[2].includes('DPS') || info[2].includes('D.P.S') || info[2].includes('DEPARTMENT OF PUBLIC SAFETY') || info[2].includes('DEPT OF PUBLIC') || info[2].includes('DEPART. OF PUBLIC') || info[2].includes('DEPT. OF PUBLIC')  || info[2].includes('DEPT PUBLIC SAFETY')) {
                    info[2] = 'DPS PATROL VEHICLE REVOLVING FUND';
                } else if ((info[2].includes('MEDICAL') && !info[2].includes('REIMBURSEMENT')) || info[2].includes('MLRF')) {
                    info[2] = 'MEDICAL EXPENSE LIABILITY REVOLVING FUND';
                } else if (info[2].includes('COURT FUND')) {
                    info[2] = 'COURT FUND';
                } else if (info[2].includes('DRUG ABUSE EDUCATION') || info[2].includes('DAETRFA')) {
                    info[2] = 'DRUG ABUSE EDUCATION TREATEMENT FUND';
                } else if (info[2].includes('CASE SENT FOR COLLECTION')) {
                    info[2] = 'CASE SENT FOR COLLECTION FEE';
                } else if (info[2].includes('WILDLIFE')) {
                    info[2] = 'WILDLIFE FINES';                    
                } else if (info[2].includes('10%') || info[2].includes('COURT CLERK') || info[2].includes('CLERK\'S FEE')) {   
                    info[2] = 'COURT CLERK REVOLVING FUND';
                }
                
                if (fee > 0) {

                    if (DATA.hasOwnProperty(info[2])) {
                        let holder = info[2];
                        DATA[holder] += fee;
                    } else {
                        let holder2 = info[2];
                        DATA[holder2] = fee;
                    }
                }
            }
        })
        } else {
            console.log('error for sumPage: ' + err);
            errors['err'] = 'there was an error parsing the project'
            
        }
      });

}





dataCollection();

let myGreeting = setTimeout(function sayHi() {
    // console.log('$$$ COUNTY   IS    ' + county);
    // Object.keys(DATA).forEach(function (item) {
    //     if ((typeof DATA[item] === 'number') && ((DATA[item]) === (DATA[item])) && ((DATA[item]) >= 100)) {
    //         console.log((typeof DATA[item] === 'number') && ((DATA[item]) === (DATA[item])) && ((DATA[item]) >= 1000))
    //         try {
    //             fs.appendFileSync('sums-fees-by-county/' + county + '.txt', item + ',' + DATA[item] + '\n');
    //         } catch (err) {
    //             console.log('************** somethings up in the writing error')
    //             errors['err2'] += 'there was an error on writing sums by county  ' + item + ',' + DATA[item];
    //         }
    //     } 
    // })
    Object.keys(counties).forEach(function (item) {
        console.log(item + '     ' + counties[item].feesCount  + '    ' + counties[item].feeTotal)
        console.log('lets try a set ' + counties[item].cmids.size + ' and contents ' + counties[item].cmids);
        // try {
        //     fs.appendFileSync('sums-fees-by-county/countytotal.txt', item + ',' + counties[item].feesCount + ',' + counties[item].feeTotal + '\n');
        // } catch (err) {
        //     console.log('************** somethings up in the writing error')
        //     errors['err2'] += 'there was an error on writing sums by county  ' + item + ',' + DATA[item];
        // }
    })
    console.log('fee for all counties    ' + allFees);

    // console.log('errors for the reading thing      ' + errors['err']);
    // console.log('errors for the writing to new fils    ' + errors['err2']);
}, 10000);