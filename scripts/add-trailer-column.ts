import { db } from '../server/db';
import { PostgresError } from 'postgres';

async function main() {
  try {
    console.log('Adding trailer column to animes table...');
    
    // Check if trailer column already exists
    const checkResult = await db.execute(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'animes' AND column_name = 'trailer';
    `);
    
    if (checkResult.length > 0) {
      console.log('Trailer column already exists, skipping migration');
    } else {
      // Add trailer column to animes table
      await db.execute(`
        ALTER TABLE animes
        ADD COLUMN trailer TEXT;
      `);
      
      console.log('Successfully added trailer column to animes table');
    }
  } catch (error) {
    if (error instanceof PostgresError) {
      console.error(`Postgres error: ${error.message}`);
    } else {
      console.error(`Error: ${error}`);
    }
  }
}

main()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });