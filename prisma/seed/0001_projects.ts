import { PrismaClient } from '@prisma/client';

export async function main(prisma: PrismaClient) {
  const TIME = 'PROJECT_SEED';
  console.time(TIME);

  const createdBy = {
    service: 'prisma',
    serviceDetail: 'prisma seed',
  };

  const project = await prisma.project.upsert({
    where: {
      id: process.env.DEFAULT_PROJECT_ID,
    },
    update: {},
    create: {
      id: process.env.DEFAULT_PROJECT_ID,
      name: 'Universal API',
      createdBy,
      updatedBy: createdBy,
    },
  });

  console.timeEnd(TIME);

  return { project };
}
