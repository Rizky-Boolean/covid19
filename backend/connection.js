const mysql = require('mysql')
// Membuat koneksi ke MySQL
const db = mysql.createConnection({
// Data koneksi ke database
    host: "127.0.0.1",
    port: 8889,
    user: "root",
    password : "root",
    database: "table"

})

db.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal: ' + err.stack)
    return
  }
  console.log('Koneksi ke database berhasil')
})

module.exports = db