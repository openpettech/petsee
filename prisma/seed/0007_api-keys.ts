import { PrismaClient, Project } from '@prisma/client';
import { generate } from 'generate-password';
import * as crypto from 'crypto';

export async function main(project: Project, prisma: PrismaClient) {
  const TIME = 'API_KEY_SEED';
  console.time(TIME);

  const createdBy = {
    service: 'prisma',
    serviceDetail: 'prisma seed',
  };

  const secretKey = generate({
    length: 100,
    uppercase: false,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  console.timeLog(TIME, `Api Key - ${secretKey}`);
  const last4 = secretKey.slice(-4);
  const hashedSecretKey = crypto
    .createHash('sha256')
    .update(secretKey)
    .digest('hex');

  await prisma.apiKey.upsert({
    where: {
      id: process.env.DEFAULT_PROJECT_ID,
    },
    update: {},
    create: {
      projectId: project.id,
      secretKey: hashedSecretKey,
      last4,
      createdBy,
      updatedBy: createdBy,
    },
  });

  console.timeEnd(TIME);
}
