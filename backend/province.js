const axios = require('axios');
const db = require('./connection'); // Pastikan ini adalah koneksi MySQL Anda

async function runProvince() {
  try {
    // Ambil semua ISO dari tabel regions
    const isoList = await new Promise((resolve, reject) => {
      db.query('SELECT iso FROM regions', (err, results) => {
        if (err) return reject(err);
        resolve(results.map(row => row.iso));
      });
    });

    // Loop untuk setiap ISO
    for (const iso of isoList) {
      const url = `https://covid-api.com/api/provinces/${iso}`;
      try {
        const response = await axios.get(url);

        if (response.data && response.data.data) {
          const provinces = response.data.data;

          for (const item of provinces) {
            const { iso, province, lat, long } = item;

            await new Promise((resolve, reject) => {
              // Cek apakah data sudah ada
              const checkQuery = `
                SELECT COUNT(*) AS count 
                FROM provinces 
                WHERE iso = ? AND province = ? AND lat = ? AND \`long\` = ?
              `;
              const checkValues = [iso, province, lat, long];

              db.query(checkQuery, checkValues, (err, results) => {
                if (err) {
                  console.error('Gagal mengecek duplikat:', err.message);
                  return reject(err);
                }

                if (results[0].count > 0) {
                  console.log(`Duplicate data: Province = ${province}, Skipping Insert`);
                  return resolve();
                }

                // Jika tidak duplikat, lakukan INSERT
                const insertQuery = `
                  INSERT INTO provinces (iso, province, lat, \`long\`) VALUES (?, ?, ?, ?)
                `;
                db.query(insertQuery, [iso, province, lat, long], (err, result) => {
                  if (err) {
                    console.error('Gagal menyimpan data:', err.message);
                  } else {
                    console.log(`Data berhasil disimpan: Province = ${province}`);
                  }
                  resolve();
                });
              });
            });
          }

          console.log(`Data provinsi untuk ${iso} selesai diproses`);
        } else {
          console.warn(`Data kosong untuk ISO: ${iso}`);
        }
      } catch (error) {
        console.error(`Gagal mengambil data untuk ${iso}: ${error.message}`);
      }
    }

    console.log('Penarikan data province selesai');
  } catch (error) {
    console.error('Terjadi kesalahan umum:', error.message);
  }
}

module.exports = { runProvince };
