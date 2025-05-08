// covidDataImporter.js
const axios = require('axios');
const db = require('./connection');
const util = require('util');

// Promisify query agar bisa pakai async/await
const query = util.promisify(db.query).bind(db);

// const fetchDataAndInsert = async (date) => {
//   const url = `https://covid-api.com/api/reports?date=${date}`;

//   try {
//     const response = await axios.get(url);
//     const data = response.data.data;

//     for (const report of data) {
//       // Cek duplikat
//       const duplicateCheckQuery = `
//         SELECT COUNT(*) AS count FROM reports 
//         WHERE date = ? AND confirmed = ? AND deaths = ? AND recovered = ? AND 
//               confirmed_diff = ? AND deaths_diff = ? AND recovered_diff = ? AND 
//               last_update = ? AND active = ? AND active_diff = ? AND fatality_rate = ?
//       `;
//       const duplicateCheckValues = [
//         report.date,
//         report.confirmed,
//         report.deaths,
//         report.recovered,
//         report.confirmed_diff,
//         report.deaths_diff,
//         report.recovered_diff,
//         report.last_update,
//         report.active,
//         report.active_diff,
//         report.fatality_rate
//       ];

//       const [duplicateResult] = await query(duplicateCheckQuery, duplicateCheckValues);

//       if (duplicateResult.count > 0) {
//         console.log(`Skipping insert: data already exists for ${report.region.name}, ${report.date}`);
//         continue;
//       }

//       // Insert ke reports
//       const reportInsertQuery = `
//         INSERT INTO reports 
//         (date, confirmed, deaths, recovered, confirmed_diff, deaths_diff, recovered_diff, last_update, active, active_diff, fatality_rate)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;
//       const reportResult = await query(reportInsertQuery, duplicateCheckValues);
//       const reports_id = reportResult.insertId;

//       // Insert ke reports_region
//       const region = report.region;
//       const regionInsertQuery = `
//         INSERT INTO reports_region 
//         (reports_id, iso, region_name, province, lat, \`long\`)
//         VALUES (?, ?, ?, ?, ?, ?)
//       `;
//       const regionInsertValues = [
//         reports_id,
//         region.iso,
//         region.name,
//         region.province,
//         region.lat,
//         region.long
//       ];
//       const regionResult = await query(regionInsertQuery, regionInsertValues);
//       const reports_region_id = regionResult.insertId;

//       // Insert ke reports_region_cities jika ada
//       if (region.cities && region.cities.length > 0) {
//         for (const city of region.cities) {
//           const cityInsertQuery = `
//             INSERT INTO reports_region_cities 
//             (reports_id, reports_region_id, city_name, fips, lat, \`long\`, confirmed, deaths, confirmed_diff, deaths_diff, last_update)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//           `;
//           const cityInsertValues = [
//             reports_id,
//             reports_region_id,
//             city.name,
//             city.fips,
//             city.lat,
//             city.long,
//             city.confirmed,
//             city.deaths,
//             city.confirmed_diff,
//             city.deaths_diff,
//             city.last_update
//           ];

//           await query(cityInsertQuery, cityInsertValues);
//         }
//       }
//     }

//     console.log("Data berhasil diproses untuk tanggal:", date);
//   } catch (error) {
//     console.error("Gagal mengambil atau memproses data:", error.message);
//   }
// };





const fetchDataAndInsert = async (date) => {
  const url = `https://covid-api.com/api/reports?date=${date}`;

  try {
    const response = await axios.get(url);
    const data = response.data.data;

    for (const report of data) {
      // Cek duplikat di reports dan reports_region
      const duplicateCheckQuery = `
        SELECT COUNT(*) AS count FROM reports r
        JOIN reports_region rr ON r.reports_id = rr.reports_id
        WHERE r.date = ? AND r.confirmed = ? AND r.deaths = ? AND r.recovered = ? AND 
              r.confirmed_diff = ? AND r.deaths_diff = ? AND r.recovered_diff = ? AND 
              r.last_update = ? AND r.active = ? AND r.active_diff = ? AND r.fatality_rate = ?
              AND rr.iso = ? AND rr.region_name = ? AND rr.province = ? AND rr.lat = ? AND rr.\`long\` = ?
      `;
      const duplicateCheckValues = [
        report.date,
        report.confirmed,
        report.deaths,
        report.recovered,
        report.confirmed_diff,
        report.deaths_diff,
        report.recovered_diff,
        report.last_update,
        report.active,
        report.active_diff,
        report.fatality_rate,
        report.region.iso,
        report.region.name,
        report.region.province,
        report.region.lat,
        report.region.long
      ];

      const [duplicateResult] = await query(duplicateCheckQuery, duplicateCheckValues);

      if (duplicateResult.count > 0) {
        console.log(`Skipping insert: data already exists for ${report.region.name}, ${report.date}`);
        continue;
      }

      // Insert ke reports
      const reportInsertQuery = `
        INSERT INTO reports 
        (date, confirmed, deaths, recovered, confirmed_diff, deaths_diff, recovered_diff, last_update, active, active_diff, fatality_rate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const reportInsertValues = [
        report.date,
        report.confirmed,
        report.deaths,
        report.recovered,
        report.confirmed_diff,
        report.deaths_diff,
        report.recovered_diff,
        report.last_update,
        report.active,
        report.active_diff,
        report.fatality_rate
      ];
      
      const reportResult = await query(reportInsertQuery, reportInsertValues);
      const reports_id = reportResult.insertId;

      // Insert ke reports_region
      const region = report.region;
      const regionInsertQuery = `
        INSERT INTO reports_region 
        (reports_id, iso, region_name, province, lat, \`long\`)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const regionInsertValues = [
        reports_id,
        region.iso,
        region.name,
        region.province,
        region.lat,
        region.long
      ];
      const regionResult = await query(regionInsertQuery, regionInsertValues);
      const reports_region_id = regionResult.insertId;

      // Insert ke reports_region_cities jika ada
      if (region.cities && region.cities.length > 0) {
        for (const city of region.cities) {
          const cityInsertQuery = `
            INSERT INTO reports_region_cities 
            (reports_id, reports_region_id, city_name, fips, lat, \`long\`, confirmed, deaths, confirmed_diff, deaths_diff, last_update)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const cityInsertValues = [
            reports_id,
            reports_region_id,
            city.name,
            city.fips,
            city.lat,
            city.long,
            city.confirmed,
            city.deaths,
            city.confirmed_diff,
            city.deaths_diff,
            city.last_update
          ];

          await query(cityInsertQuery, cityInsertValues);
        }
      }
    }

    console.log("Data berhasil diproses untuk tanggal:", date);
  } catch (error) {
    console.error("Gagal mengambil atau memproses data:", error.message);
  }
};

module.exports = { fetchDataAndInsert };
