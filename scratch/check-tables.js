const fs = require('fs');
const readline = require('readline');

async function checkTables() {
    const fileStream = fs.createReadStream('oldphpbackup/smenews_newsposts.json');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const match = line.match(/"type":"table","name":"([^"]+)"/);
        if (match) {
            console.log('Found table:', match[1]);
        }
    }
}

checkTables();
