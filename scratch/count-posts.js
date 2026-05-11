const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: fs.createReadStream('oldphpbackup/smenews_newsposts.json')
});

let inPosts = false;
let count = 0;
let linesPrinted = 0;

rl.on('line', l => {
    if (l.includes('"name":"posts"')) {
        inPosts = true;
    } else if (inPosts && l.includes('"type":"table"')) {
        inPosts = false;
    }
    
    if (inPosts) {
        const trimmed = l.trim();
        // Since lines are comma separated, they might start with `,{"id":` or `{"id":`
        if (trimmed.startsWith('{"id":') || trimmed.startsWith(',{"id":')) {
            count++;
            if (linesPrinted < 2) {
                console.log(trimmed);
                linesPrinted++;
            }
        }
    }
}).on('close', () => {
    console.log('Total posts matching:', count);
});
