const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function run() {
  try {
    const contents = await prisma.content.findMany({
      include: {
        directors: true
      }
    });
    console.log(`Found ${contents.length} content items in database.`);
    fs.writeFileSync('prisma/data/exported_db.json', JSON.stringify(contents, null, 2));
    console.log('Successfully exported to prisma/data/exported_db.json');
  } catch (e) {
    console.error('Error exporting database:', e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
