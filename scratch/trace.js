const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: fs.createReadStream('oldphpbackup/smenews_newsposts.json')
});

let currentTable = null;
let count = 0;

rl.on('line', l => {
    const tableMatch = l.match(/"type":"table","name":"([^"]+)"/);
    if (tableMatch) {
        currentTable = tableMatch[1];
        console.log(`Entering table: ${currentTable}`);
        return;
    }

    if (currentTable === 'posts') {
        const trimmed = l.trim();
        if (trimmed.startsWith('{"id":') || trimmed.startsWith(',{"id":')) {
            count++;
            if (count === 1) console.log("First post found!");
        }
    }
}).on('close', () => {
    console.log('Total posts processed logic:', count);
});
