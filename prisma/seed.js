require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')

const connectionString = `${process.env.DATABASE_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  const categories = [
    { name: 'ពាណិជ្ជកម្ម', slug: 'business' },
    { name: 'សង្គមជាតិ-សេដ្ឋកិច្ច', slug: 'economy' },
    { name: 'នវានុវត្តន៍-បច្ចេកវិទ្យា', slug: 'tech' },
    { name: 'កសិកម្ម', slug: 'agriculture' },
    { name: 'ធនាគារ-ហិរញ្ញវត្ថុ', slug: 'finance' },
    { name: 'គំនិតអាជីវកម្ម', slug: 'ideas' },
    { name: 'វីដេអូ', slug: 'video' },
  ]

  console.log('Seeding categories...')
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Create or update admin user
  const user = await prisma.user.upsert({
    where: { email: 'admin@smenews.com.kh' },
    update: {},
    create: {
      name: 'ទូច សូរិយា',
      email: 'admin@smenews.com.kh',
      image: 'https://i.pravatar.cc/150?u=admin'
    },
  })

  console.log('Seed finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
