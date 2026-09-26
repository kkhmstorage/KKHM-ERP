const fs = require('fs');
const content = fs.readFileSync('c:/Users/OPTIMA/Downloads/New/Fee/KKHM/WAFY-WAFIYYA-TIME-TABLE/index.html', 'utf8');

const mIdx = content.indexOf('id="admin-login-modal"');
const mEnd = content.indexOf('<!-- SHARE LINK MODAL -->', mIdx);
console.log('--- ADMIN LOGIN MODAL EXACT FULL ---');
console.log(content.substring(mIdx - 50, mEnd));
