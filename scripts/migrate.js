const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({});

const oldImageDir = path.join(__dirname, '../oldphpbackup/smenews_image8976333.jpg');
const newImageDir = path.join(__dirname, '../public/uploads');

function makeSlug(text, id) {
    if (!text) return `post-${id}`;
    let s = text.trim().replace(/[\s\/?&#%=\\"'.,:;()\[\]{}*+!]+|[\u200B-\u200D\uFEFF]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!s) return `post-${id}`;
    return `${s}-${id}`;
}

async function migrate() {
    if (!fs.existsSync(newImageDir)) {
        fs.mkdirSync(newImageDir, { recursive: true });
    }

    const fileStream = fs.createReadStream(path.join(__dirname, '../oldphpbackup/smenews_newsposts.json'));
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let currentTable = null;
    let categoriesMap = {}; // oldId -> newId
    let usersMap = {}; // oldAuthorName -> newId

    // Pre-cache users
    const dbUsers = await prisma.user.findMany();
    for (const u of dbUsers) {
        usersMap[u.name || u.username] = u.id;
    }

    console.log("Starting migration. Parsing tables...");
    
    let postBuffer = [];
    const BATCH_SIZE = 20;
    let postsProcessed = 0;

    for await (const line of rl) {
        const tableMatch = line.match(/"type":"table","name":"([^"]+)"/);
        if (tableMatch) {
            currentTable = tableMatch[1];
            console.log(`\nEntering table: ${currentTable}`);
            continue;
        }

        if (currentTable === 'category') {
            if (line.startsWith('{"id":')) {
                try {
                    const cleanLine = line.trim().replace(/,$/, '');
                    const catObj = JSON.parse(cleanLine);
                    const slug = makeSlug(catObj.name, catObj.id);
                    let dbCat = await prisma.category.findUnique({ where: { slug } });
                    if (!dbCat) {
                        dbCat = await prisma.category.create({
                            data: {
                                name: catObj.name || `Category ${catObj.id}`,
                                slug: slug
                            }
                        });
                        console.log(`Created category: ${catObj.name}`);
                    }
                    categoriesMap[catObj.id] = dbCat.id;
                } catch (e) {
                    console.error("Parse error in category:", e.message);
                }
            }
        }

        if (currentTable === 'posts') {
            if (line.startsWith('{"id":')) {
                try {
                    const cleanLine = line.trim().replace(/,$/, '');
                    const postObj = JSON.parse(cleanLine);
                    postBuffer.push(postObj);

                    if (postBuffer.length >= BATCH_SIZE) {
                        await processPostsBatch(postBuffer, categoriesMap, usersMap);
                        postsProcessed += postBuffer.length;
                        console.log(`Processed ${postsProcessed} posts...`);
                        postBuffer = [];
                    }
                } catch (e) {
                    console.error("Parse error in post:", e.message);
                }
            }
        }
    }

    if (postBuffer.length > 0) {
        await processPostsBatch(postBuffer, categoriesMap, usersMap);
        postsProcessed += postBuffer.length;
        console.log(`Processed ${postsProcessed} posts...`);
    }

    console.log("Migration complete!");
}

async function processPostsBatch(posts, categoriesMap, usersMap) {
    for (const oldPost of posts) {
        try {
            // 1. Author
            let authorId = null;
            const authorName = oldPost.author ? oldPost.author.trim() : 'Unknown';
            if (usersMap[authorName]) {
                authorId = usersMap[authorName];
            } else {
                let username = makeSlug(authorName, Math.floor(Math.random() * 1000));
                // Ensure uniqueness
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
                console.log(`Created author: ${authorName}`);
            }

            // 2. Category
            let categoryId = categoriesMap[oldPost.category];
            if (!categoryId && oldPost.category) {
                const catName = `Category ${oldPost.category}`;
                const slug = makeSlug(catName, oldPost.category);
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
                // Handle phpmyadmin slashes if any
                imageName = imageName.replace(/\\/g, '');
                const oldImagePath = path.join(oldImageDir, imageName);
                const newImagePath = path.join(newImageDir, imageName);
                
                if (fs.existsSync(oldImagePath)) {
                    if (!fs.existsSync(newImagePath)) {
                        fs.copyFileSync(oldImagePath, newImagePath);
                    }
                    featuredImage = `/uploads/${imageName}`;
                }
            }

            // 4. Post
            const slug = makeSlug(oldPost.title, oldPost.id);
            
            const existing = await prisma.post.findUnique({ where: { slug } });
            if (!existing) {
                await prisma.post.create({
                    data: {
                        title: oldPost.title || 'Untitled',
                        slug: slug,
                        content: oldPost.content || '',
                        featuredImage: featuredImage,
                        published: true,
                        viewCount: parseInt(oldPost.views) || 0,
                        categoryId: categoryId,
                        authorId: authorId,
                        createdAt: oldPost.date_created && oldPost.date_created !== '0000-00-00 00:00:00' ? new Date(oldPost.date_created) : new Date(),
                    }
                });
            }

        } catch (e) {
            console.error(`Error processing post ${oldPost.id}: ${e.message}`);
        }
    }
}

migrate().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
