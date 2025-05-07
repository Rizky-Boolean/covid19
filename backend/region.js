const axios = require('axios');
const db = require('./connection');

// Alamat API regions
const apiUrl = 'https://covid-api.com/api/regions';

async function runRegions() {
  try {
    // Mengambil data dari API
    const response = await axios.get(apiUrl);

    if (response.data && response.data.data) {
      const regions = response.data.data;

      // Gunakan for...of agar bisa menunggu query async
      for (const region of regions) {
        const { iso, name } = region;

        // Cek apakah data sudah ada
        const checkQuery = 'SELECT COUNT(*) AS count FROM regions WHERE iso = ? AND name = ?';
        const checkValues = [iso, name];

        await new Promise((resolve, reject) => {
          db.query(checkQuery, checkValues, (err, results) => {
            if (err) {
              console.error('Gagal melakukan pengecekan data:', err.message);
              return reject(err);
            }

            if (results[0].count > 0) {
              console.log(`Duplicate data: ISO = ${iso}, Skipping Insert`);
              return resolve();
            }

            // Jika tidak duplikat, lakukan INSERT
            const insertQuery = 'INSERT INTO regions (iso, name) VALUES (?, ?)';
            db.query(insertQuery, [iso, name], (err, result) => {
              if (err) {
                console.error('Gagal menyimpan data:', err.message);
              } else {
                console.log(`Data berhasil disimpan: ISO = ${iso}, Name = ${name}`);
              }
              resolve();
            });
          });
        });
      }
    } else {
      console.error('Data tidak ditemukan dalam respon API');
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat memanggil API:', error.message);
  }
}

module.exports = { runRegions };
