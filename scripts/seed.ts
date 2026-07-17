const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const GITHUB_API_URL = 'https://api.github.com';

const FAMOUS_DEVS = [
  'torvalds',
  'yyx990803',
  'gaearon',
  'sindresorhus',
  'tj',
  'Rich-Harris',
  'dhh',
  'mrdoob',
  'fabpot',
  'paulirish'
];

async function seed() {
  console.log('Seeding Database...');
  
  for (const username of FAMOUS_DEVS) {
    try {
      console.log(`Processing ${username}...`);
      const res = await fetch(`http://localhost:3000/api/aura/${username}`);
      if (res.ok) {
        console.log(`✅ Upserted ${username}`);
      } else {
        console.log(`❌ Failed ${username}: ${await res.text()}`);
      }
      
      // Wait to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.error(e);
    }
  }
  
  console.log('Database seeding complete!');
}

seed();
