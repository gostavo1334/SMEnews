const fs = require('fs');
const readline = require('readline');

async function peek() {
    const fileStream = fs.createReadStream('oldphpbackup/smenews_newsposts.json');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let inPosts = false;
    let count = 0;
    for await (const line of rl) {
        if (line.includes('"name":"posts"')) {
            inPosts = true;
        }
        if (inPosts) {
            console.log(line);
            count++;
            if (count > 5) break;
        }
    }
}

peek();
