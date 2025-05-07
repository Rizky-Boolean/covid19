const express = require('express');
const { runRegions } = require('./region');
const { runProvince } = require('./province');
const fetchDataAndInsert = require('./report');

const app = express();
const port = 5010; // Port untuk server Express
const date = '2020-03-23';

app.use(express.json());

// Fungsi delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi async untuk menjalankan proses dengan jeda
const runAll = async () => {
  console.log("Memulai Region Runner...");

  await runRegions();
  console.log("Selesai runRegions, tunggu 0.1 detik...");
  await delay(100);

  await runProvince();
  console.log("Selesai runProvince, tunggu 0.1 detik...");
  await delay(100);

  await fetchDataAndInsert(date);
  console.log("Selesai fetchDataAndInsert");
};

// Jalankan semua proses
runAll();

// Mulai server Express
app.listen(port, () => {
  console.log(`Region Runner aktif di PORT: ${port}`);
});
