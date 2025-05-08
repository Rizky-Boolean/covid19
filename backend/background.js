const express = require('express');
const cron = require('node-cron');
const { runRegions } = require('./region');
const { runProvince } = require('./province');
const { fetchDataAndInsert } = require('./report');

const app = express();
const port = 5010;

app.use(express.json());

// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYYMMDD
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Fungsi delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi format tanggal ke YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

// Fungsi async utama
const runAll = async () => {
  console.log("Memulai Region Runner...");

  await runRegions();
  console.log("Selesai runRegions, tunggu 0.1 detik...");
  await delay(100);

  await runProvince();
  console.log("Selesai runProvince, tunggu 0.1 detik...");
  await delay(100);

  // Mulai tanggal 2020-03-01 sampai 2020-03-30
  let currentDate = new Date('2020-03-01');
  const endDate = new Date('2020-03-30');

  while (currentDate <= endDate) {
    const formattedDate = formatDate(currentDate);
    console.log(`Memproses data untuk tanggal ${formattedDate}...`);
    await fetchDataAndInsert(formattedDate);
    await delay(100); // Optional: jeda antar pemrosesan
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log("Selesai semua fetchDataAndInsert untuk Maret 2020.");
};

// Jalankan semua proses
runAll();

// jalankan setiap 6 jam sekali
cron.schedule('0 */6 * * *', () => {
  console.log('Memulai sinkronisasi data...');
  fetchDataAndInsert(getTodayDate());
});

// Mulai server Express
app.listen(port, () => {
  console.log(`Region Runner aktif di PORT: ${port}`);
});
