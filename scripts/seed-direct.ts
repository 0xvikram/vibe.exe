import { computeAura } from '../lib/computeAura';
import { prisma } from '../lib/db';

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
  console.log('Seeding Database Directly...');
  
  for (const username of FAMOUS_DEVS) {
    try {
      console.log(`Processing ${username}...`);
      const aura = await computeAura(username);
      
      const score = aura.totalEvents * (1 + (1 / Math.max(0.1, aura.variance))) * Math.max(1, aura.reposCount);

      await prisma.auraUser.upsert({
        where: { username: aura.username.toLowerCase() },
        update: {
          avatarUrl: aura.avatar,
          title: aura.title,
          score,
          nightOwlPercent: aura.nightOwlPercent,
          variance: aura.variance,
          reposCount: aura.reposCount,
          totalEvents: aura.totalEvents,
          topColor: aura.colors[0] || '#ffffff'
        },
        create: {
          username: aura.username.toLowerCase(),
          avatarUrl: aura.avatar,
          title: aura.title,
          score,
          nightOwlPercent: aura.nightOwlPercent,
          variance: aura.variance,
          reposCount: aura.reposCount,
          totalEvents: aura.totalEvents,
          topColor: aura.colors[0] || '#ffffff'
        }
      });
      console.log(`✅ Upserted ${username}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.error(`❌ Failed ${username}:`, e);
    }
  }
  
  console.log('Database seeding complete!');
}

seed();
