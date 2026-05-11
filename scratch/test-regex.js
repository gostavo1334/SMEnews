const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: fs.createReadStream('oldphpbackup/smenews_newsposts.json')
});

let i = 0;
rl.on('line', l => {
    const m = l.match(/"type":"table","name":"([^"]+)"/);
    if (m) console.log('Match:', m[1]);
    
    // Stop early for testing
    if (m && m[1] === 'posts_copy') process.exit(0);
});
