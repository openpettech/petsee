import { PrismaClient } from '@prisma/client';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';

import { localeMapper } from './mappers';
import type { IReferenceCategory } from './interfaces';

export async function main(prisma: PrismaClient) {
  const TIME = 'REFERENCE_CATEGORIES_SEED';
  console.time(TIME);

  // Url - https://docs.google.com/spreadsheets/d/1OCttWAXiRs40FT5i_T-JsfEi0ewGbVcGtyi2E3dNwJw
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const options = {
    sheetName: 'Reference Categories',
  };
  const parser = new PublicGoogleSheetsParser(SPREADSHEET_ID, options);
  const entries: IReferenceCategory[] = await parser.parse();

  const createdBy = {
    service: 'prisma',
    serviceDetail: 'prisma seed',
  };

  console.timeLog(TIME, `${entries.length} reference categories to seed`);
  let progress = 0;

  for (const entry of entries) {
    try {
      const { id, ...lanugages } = entry;

      await prisma.referenceCategory.upsert({
        where: {
          id,
        },
        update: {},
        create: {
          id,
          createdBy,
          updatedBy: createdBy,
        },
      });

      await Promise.all(
        Object.keys(lanugages).map(async (key) => {
          const locale = localeMapper(key);

          await prisma.referenceCategoryTranslation.upsert({
            where: {
              referenceCategoryId_locale: {
                referenceCategoryId: id,
                locale,
              },
            },
            update: {
              name: lanugages[key],
              updatedBy: createdBy,
            },
            create: {
              referenceCategoryId: id,
              locale,
              name: lanugages[key],
              createdBy,
              updatedBy: createdBy,
            },
          });
        }),
      );
    } catch (err) {
      console.timeLog(TIME, `Error ${entry.id} - ${err.message}`);
    } finally {
      progress++;
      console.timeLog(TIME, `Processed ${progress} of ${entries.length}`);
    }
  }

  console.timeLog(TIME, `Finished seeding reference categories`);
  console.timeEnd(TIME);
}
