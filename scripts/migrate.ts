import 'dotenv/config';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const logFile = fs.createWriteStream('migrate.log');
function log(msg) {
    console.log(msg);
    logFile.write(msg + '\n');
}
function errorLog(msg) {
    console.error(msg);
    logFile.write('ERROR: ' + msg + '\n');
}
import { fileURLToPath } from 'url';
import { prisma } from '../lib/prisma'; // Use the configured prisma client

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const oldImageDir = path.join(__dirname, '../oldphpbackup/smenews_image8976333.jpg');
const newImageDir = path.join(__dirname, '../public/uploads/images');

function makeSlug(text, id, isPost = false) {
    if (isPost) return `post-${id}`;
    if (!text) return `cat-${id}`;
    let s = text.trim().replace(/[\s\/?&#%=\\"'.,:;()\[\]{}*+!]+|[\u200B-\u200D\uFEFF]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!s) return `cat-${id}`;
    return `${s}-${id}`;
}

async function migrate() {
    if (!fs.existsSync(newImageDir)) {
        fs.mkdirSync(newImageDir, { recursive: true });
    }

    let currentTable = null;
    let categoriesMap = {}; // oldId -> newId
    let usersMap = {}; // oldAuthorName -> newId

    // Pre-cache users
    const dbUsers = await prisma.user.findMany();
    for (const u of dbUsers) {
        usersMap[u.name || u.username] = u.id;
    }

    const fileStream = fs.createReadStream(path.join(__dirname, '../oldphpbackup/smenews_newsposts.json'));
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    console.log("Starting migration. Parsing tables...");
    
    let postBuffer = [];
    const BATCH_SIZE = 500;
    let postsProcessed = 0;

    for await (const line of rl) {
        const tableMatch = line.match(/"type":"table","name":"([^"]+)"/);
        if (tableMatch) {
            currentTable = tableMatch[1];
            log(`\nEntering table: ${currentTable}`);
            continue;
        }

        if (currentTable === 'category') {
            const trimmed = line.trim();
            if (trimmed.startsWith('{"id":') || trimmed.startsWith(',{"id":')) {
                try {
                    const cleanLine = trimmed.replace(/^,/, '').replace(/,$/, '');
                    const catObj = JSON.parse(cleanLine);
                    const catSlugMap: Record<number, string> = {
                        1: 'society',
                        2: 'sme',
                        3: 'tech',
                        4: 'finance',
                        5: 'commerce',
                        6: 'ideas',
                        7: 'video',
                        8: 'downloads'
                    };
                    const slug = catSlugMap[catObj.id] || makeSlug(catObj.name, catObj.id);
                    let dbCat = await prisma.category.findUnique({ where: { slug } });
                    if (!dbCat) {
                        dbCat = await prisma.category.create({
                            data: {
                                name: catObj.name || `Category ${catObj.id}`,
                                slug: slug
                            }
                        });
                        log(`Created category: ${catObj.name}`);
                    }
                    categoriesMap[catObj.id] = dbCat.id;
                } catch (e) {
                    errorLog("Parse error in category: " + e.message);
                }
            }
        }

        if (currentTable === 'posts') {
            const trimmed = line.trim();
            if (trimmed.startsWith('{"id":') || trimmed.startsWith(',{"id":')) {
                try {
                    const cleanLine = trimmed.replace(/^,/, '').replace(/,$/, '');
                    const postObj = JSON.parse(cleanLine);
                    postBuffer.push(postObj);

                    if (postBuffer.length >= BATCH_SIZE) {
                        await processPostsBatch(postBuffer, categoriesMap, usersMap);
                        postsProcessed += postBuffer.length;
                        log(`Processed ${postsProcessed} posts...`);
                        postBuffer = [];
                    }
                } catch (e) {
                    errorLog("Parse error in post: " + e.message);
                }
            }
        }
    }

    if (postBuffer.length > 0) {
        await processPostsBatch(postBuffer, categoriesMap, usersMap);
        postsProcessed += postBuffer.length;
        log(`Processed ${postsProcessed} posts...`);
    }

    log("Migration complete!");
}

async function processPostsBatch(posts, categoriesMap, usersMap) {
    const postsToCreate = [];
    for (const oldPost of posts) {
        try {
            // 1. Author
            let authorId = null;
            const authorName = oldPost.author ? oldPost.author.trim() : 'Unknown';
            if (usersMap[authorName]) {
                authorId = usersMap[authorName];
            } else {
                let username = makeSlug(authorName, Math.floor(Math.random() * 1000));
                const existU = await prisma.user.findUnique({where: {username}});
                if (existU) username += `-${Math.floor(Math.random() * 1000)}`;

                const newUser = await prisma.user.create({
                    data: {
                        name: authorName,
                        username: username,
                        role: 'reporter',
                    }
                });
                usersMap[authorName] = newUser.id;
                authorId = newUser.id;
                log(`Created author: ${authorName}`);
            }

            // 2. Category
            let categoryId = categoriesMap[oldPost.category];
            if (!categoryId && oldPost.category) {
                const catSlugMap: Record<number, string> = {
                    1: 'society',
                    2: 'sme',
                    3: 'tech',
                    4: 'finance',
                    5: 'commerce',
                    6: 'ideas',
                    7: 'video',
                    8: 'downloads'
                };
                const catName = `Category ${oldPost.category}`;
                const slug = catSlugMap[oldPost.category] || makeSlug(catName, oldPost.category);
                let dbCat = await prisma.category.findUnique({ where: { slug } });
                if (!dbCat) {
                    dbCat = await prisma.category.create({
                        data: { name: catName, slug }
                    });
                }
                categoriesMap[oldPost.category] = dbCat.id;
                categoryId = dbCat.id;
            }

            // 3. Image
            let featuredImage = null;
            if (oldPost.image) {
                let imageName = path.basename(oldPost.image);
                imageName = imageName.replace(/\\/g, '');
                const oldImagePath = path.join(oldImageDir, imageName);
                const newImagePath = path.join(newImageDir, imageName);
                
                if (fs.existsSync(oldImagePath)) {
                    if (!fs.existsSync(newImagePath)) {
                        fs.copyFileSync(oldImagePath, newImagePath);
                    }
                    featuredImage = `/uploads/images/${imageName}`;
                }
            }

            // 4. Post
            const slug = makeSlug(oldPost.title, oldPost.id, true);
            postsToCreate.push({
                title: oldPost.title || 'Untitled',
                slug: slug,
                content: oldPost.content || '',
                featuredImage: featuredImage,
                published: true,
                viewCount: parseInt(oldPost.views) || 0,
                categoryId: categoryId,
                authorId: authorId,
                createdAt: oldPost.date_created && oldPost.date_created !== '0000-00-00 00:00:00' ? new Date(oldPost.date_created) : new Date(),
            });

        } catch (e) {
            errorLog(`Error processing post ${oldPost.id}: ${e.message}`);
        }
    }
    
    if (postsToCreate.length > 0) {
        try {
            await prisma.post.createMany({
                data: postsToCreate,
                skipDuplicates: true
            });
        } catch (e) {
            errorLog(`Failed to createMany posts: ${e.message}`);
        }
    }
}

migrate().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
