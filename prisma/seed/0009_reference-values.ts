import { PrismaClient } from '@prisma/client';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';

import { localeMapper } from './mappers';
import type { IReferenceValue } from './interfaces';

interface IOptions {
  sheetName: string;
}

export async function main(prisma: PrismaClient, { sheetName }: IOptions) {
  const TIME = `${sheetName.toUpperCase().split('-').join('_')}_SEED`;
  console.time(TIME);

  // Url - https://docs.google.com/spreadsheets/d/1OCttWAXiRs40FT5i_T-JsfEi0ewGbVcGtyi2E3dNwJw
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const options = {
    sheetName,
  };
  const parser = new PublicGoogleSheetsParser(SPREADSHEET_ID, options);
  const entries: IReferenceValue[] = await parser.parse();

  const createdBy = {
    service: 'prisma',
    serviceDetail: 'prisma seed',
  };

  console.timeLog(
    TIME,
    `${entries.length} of ${sheetName.split('-').join(' ')} to seed`,
  );
  let progress = 0;

  for (const entry of entries) {
    try {
      const {
        id,
        speciesId,
        referenceCategoryId,
        min,
        max,
        unit,
        ...lanugages
      } = entry;

      await prisma.referenceValue.upsert({
        where: {
          id,
          speciesId,
          referenceCategoryId,
        },
        update: {},
        create: {
          id,
          speciesId,
          referenceCategoryId,
          min,
          max,
          unit,
          createdBy,
          updatedBy: createdBy,
        },
      });

      await Promise.all(
        Object.keys(lanugages).map(async (key) => {
          const locale = localeMapper(key);

          await prisma.referenceValueTranslation.upsert({
            where: {
              referenceValueId_locale: {
                referenceValueId: id,
                locale,
              },
            },
            update: {
              name: lanugages[key],
              updatedBy: createdBy,
            },
            create: {
              referenceValueId: id,
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

  console.timeLog(TIME, `Finished seeding ${sheetName.split('-').join(' ')}`);
  console.timeEnd(TIME);
}
