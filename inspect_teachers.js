const fs = require('fs');
const content = fs.readFileSync('c:/Users/OPTIMA/Downloads/New/Fee/KKHM/WAFY-WAFIYYA-TIME-TABLE/index.html', 'utf8');

const tListIdx = content.indexOf('id="teachers-list"');
console.log('--- teachers-list container in HTML ---');
console.log(content.substring(tListIdx - 300, tListIdx + 400));
