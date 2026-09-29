const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://firestore.googleapis.com/v1/projects/kkhm-islamic-and-arts-college/databases/(default)/documents/erp_system/database';

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const stds = json.fields.students.arrayValue.values;
            
            const escapeCSV = (val) => {
                if (val === undefined || val === null) return '';
                let str = String(val).trim();
                if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
                    return '"' + str.replace(/"/g, '""') + '"';
                }
                return str;
            };

            const headers = 'adm No,name,class,phone,yearly Fee,monthly Fee,total Paid,fee Start Date,due Day,password\n';
            
            const rows = stds.map(item => {
                const f = item.mapValue.fields;
                const admNo = (f.admNo && (f.admNo.stringValue || f.admNo.integerValue)) || '';
                const name = (f.name && f.name.stringValue) || '';
                const cls = (f.class && f.class.stringValue) || '';
                const phone = (f.phone && f.phone.stringValue) || '';
                const yearlyFee = (f.yearlyFee && (f.yearlyFee.integerValue || f.yearlyFee.stringValue)) || '0';
                const monthlyFee = (f.monthlyFee && (f.monthlyFee.integerValue || f.monthlyFee.stringValue)) || '0';
                const totalPaid = (f.totalPaid && (f.totalPaid.integerValue || f.totalPaid.stringValue)) || '0';
                const feeStartDate = (f.feeStartDate && f.feeStartDate.stringValue) || '01-Jun-26';
                const dueDay = (f.dueDay && (f.dueDay.integerValue || f.dueDay.stringValue)) || '25';
                const password = (f.password && f.password.stringValue) || admNo || 'pass';

                return [
                    escapeCSV(admNo),
                    escapeCSV(name),
                    escapeCSV(cls),
                    escapeCSV(phone),
                    escapeCSV(yearlyFee),
                    escapeCSV(monthlyFee),
                    escapeCSV(totalPaid),
                    escapeCSV(feeStartDate),
                    escapeCSV(dueDay),
                    escapeCSV(password)
                ].join(',');
            }).join('\n');

            const csvContent = '\uFEFF' + headers + rows;
            
            // 1. Save in workspace: C:\Users\OPTIMA\Downloads\New\Fee\KKHM\Fee_App\KKHM_Students_Data.csv
            const path1 = path.join(__dirname, 'KKHM_Students_Data.csv');
            fs.writeFileSync(path1, csvContent, 'utf8');
            console.log('Saved 1:', path1);

            // 2. Also save in Downloads: C:\Users\OPTIMA\Downloads\KKHM_Students_Data.csv
            const path2 = 'C:\\Users\\OPTIMA\\Downloads\\KKHM_Students_Data.csv';
            try {
                fs.writeFileSync(path2, csvContent, 'utf8');
                console.log('Saved 2:', path2);
            } catch(e) {
                console.warn('Could not write to downloads directly:', e.message);
            }

            console.log('Successfully exported ' + stds.length + ' students to CSV!');
        } catch(err) {
            console.error('Error generating CSV:', err);
        }
    });
});
