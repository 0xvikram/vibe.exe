import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MOCK_RIVALS = [
  {
    username: 'torvalds',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    title: 'Linux Kernel Ascendant (Zen)',
    score: 8540,
    nightOwlPercent: 12,
    variance: 0.1,
    reposCount: 30,
    totalEvents: 300,
    topColor: '#f1e05a'
  },
  {
    username: 'gaearon',
    avatarUrl: 'https://avatars.githubusercontent.com/u/810438?v=4',
    title: 'React Alchemist (Chaotic)',
    score: 6420,
    nightOwlPercent: 45,
    variance: 0.4,
    reposCount: 45,
    totalEvents: 250,
    topColor: '#3178c6'
  },
  {
    username: 'tj',
    avatarUrl: 'https://avatars.githubusercontent.com/u/25254?v=4',
    title: 'Node.js Pioneer',
    score: 7200,
    nightOwlPercent: 30,
    variance: 0.2,
    reposCount: 120,
    totalEvents: 280,
    topColor: '#3572A5'
  },
  {
    username: 'sindresorhus',
    avatarUrl: 'https://avatars.githubusercontent.com/u/170270?v=4',
    title: 'Open Source Titan',
    score: 9500,
    nightOwlPercent: 60,
    variance: 0.05,
    reposCount: 300,
    totalEvents: 350,
    topColor: '#f1e05a'
  },
  {
    username: 'rich-harris',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1162160?v=4',
    title: 'Svelte Sorcerer',
    score: 5900,
    nightOwlPercent: 25,
    variance: 0.3,
    reposCount: 50,
    totalEvents: 210,
    topColor: '#ff3e00'
  }
];

async function seedMock() {
  console.log('Seeding Database with Mock Data (bypassing rate limits)...');
  
  for (const rival of MOCK_RIVALS) {
    try {
      await prisma.auraUser.upsert({
        where: { username: rival.username.toLowerCase() },
        update: rival,
        create: rival
      });
      console.log(`✅ Upserted ${rival.username}`);
    } catch (e) {
      console.error(`❌ Failed ${rival.username}:`, e);
    }
  }
  
  console.log('Database mock seeding complete!');
}

seedMock();
