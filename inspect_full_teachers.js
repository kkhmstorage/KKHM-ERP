const fs = require('fs');
const content = fs.readFileSync('c:/Users/OPTIMA/Downloads/New/Fee/KKHM/WAFY-WAFIYYA-TIME-TABLE/index.html', 'utf8');

const tStart = content.indexOf('function renderTeachersList()');
const tEnd = content.indexOf('function renderAllotmentsList()');
console.log('--- renderTeachersList FULL ---');
console.log(content.substring(tStart, tEnd));
