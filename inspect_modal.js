const fs = require('fs');
const content = fs.readFileSync('c:/Users/OPTIMA/Downloads/New/Fee/KKHM/WAFY-WAFIYYA-TIME-TABLE/index.html', 'utf8');

const mIdx = content.indexOf('id="admin-login-modal"');
console.log('--- ADMIN LOGIN MODAL END ---');
console.log(content.substring(mIdx + 1200, mIdx + 3200));
