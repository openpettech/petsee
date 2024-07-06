import { PrismaClient } from '@prisma/client';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';

import { localeMapper } from './mappers';
import type { ISpecies } from './interfaces';

export async function main(prisma: PrismaClient) {
  const TIME = 'SPECIES_SEED';
  console.time(TIME);

  // Url - https://docs.google.com/spreadsheets/d/1OCttWAXiRs40FT5i_T-JsfEi0ewGbVcGtyi2E3dNwJw
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const options = {
    sheetName: 'Species',
  };
  const parser = new PublicGoogleSheetsParser(SPREADSHEET_ID, options);
  const entries: ISpecies[] = await parser.parse();

  const createdBy = {
    service: 'prisma',
    serviceDetail: 'prisma seed',
  };

  console.timeLog(TIME, `${entries.length} species to seed`);
  let progress = 0;

  console.log('entries', entries);

  for (const entry of entries) {
    try {
      const { id, ...lanugages } = entry;

      await prisma.species.upsert({
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

          await prisma.speciesTranslation.upsert({
            where: {
              speciesId_locale: {
                speciesId: id,
                locale,
              },
            },
            update: {
              name: lanugages[key],
              updatedBy: createdBy,
            },
            create: {
              speciesId: id,
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

  console.timeLog(TIME, `Finished seeding species`);
  console.timeEnd(TIME);
}
