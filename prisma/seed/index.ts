import { PrismaClient } from '@prisma/client';

import { main as projectSeed } from './0001_projects';
import { main as speciesSeed } from './0002_species';
import { main as breedSeed } from './0003_breeds';
import { main as allergenSeed } from './0004_allergens';
import { main as diagnoseSeed } from './0005_diagnoses';
import { main as bloodGroupSeed } from './0006_blood-groups';
import { main as apiKeySeed } from './0007_api-keys';
import { main as referenceCategorySeed } from './0008_reference-categories';

const prisma = new PrismaClient();

async function main() {
  const TIME = 'PRISMA_SEED';
  console.time(TIME);
  const { project } = await projectSeed(prisma);
  await speciesSeed(prisma);

  await breedSeed(prisma, {
    sheetName: 'Breed-Dog',
  });
  await breedSeed(prisma, {
    sheetName: 'Breed-Cat',
  });
  await breedSeed(prisma, {
    sheetName: 'Breed-Rabbit',
  });
  await breedSeed(prisma, {
    sheetName: 'Breed-Horse',
  });
  await allergenSeed(prisma);
  await diagnoseSeed(prisma);

  await bloodGroupSeed(prisma, {
    sheetName: 'Blood-Group-Dog',
  });
  await bloodGroupSeed(prisma, {
    sheetName: 'Blood-Group-Cat',
  });
  await bloodGroupSeed(prisma, {
    sheetName: 'Blood-Group-Rabbit',
  });
  await bloodGroupSeed(prisma, {
    sheetName: 'Blood-Group-Horse',
  });
  await apiKeySeed(project, prisma);
  await referenceCategorySeed(prisma);

  console.timeEnd(TIME);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
