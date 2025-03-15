const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');
const { pool } = require('../my-health-app/backend/database');

const csvFilePath = path.join(__dirname, 'australian_postcodes.csv');

async function importData() {
  try {
    const parser = fs
      .createReadStream(csvFilePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true
      }));

    for await (const record of parser) {
      try {
        await pool.query(
          'INSERT INTO australian_postcodes (postcode, suburb, state, latitude, longitude) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE suburb=VALUES(suburb), state=VALUES(state), latitude=VALUES(latitude), longitude=VALUES(longitude)',
          [record.postcode, record.locality, record.state, record.lat, record.long]
        );
        console.log(`Successfully imported data for postcode: ${record.postcode}`);
      } catch (error) {
        console.error(`Error importing data for postcode ${record.postcode}:`, error.message);
      }
    }

    console.log('Data import completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error reading CSV file:', error);
    process.exit(1);
  }
}

importData();