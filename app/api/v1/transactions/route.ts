import { connect, close } from "@/lib/db-mssql";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const date = searchParams.get("date");

  if (!date) {
    return new Response("Date is required", { status: 400 });
  }

  try {
    const pool = await connect();
    // Menghubungkan ke database

    // Lakukan operasi database di sini
    const result = await pool.query`SELECT
        CAST(t.tgl_entri AS DATE) AS tgl_entri,
        t.kode_produk,
        r.nama AS nama_reseller,
        m.label AS nama_modul,
        r.keterangan AS nama_crm,
        t.harga,
        t.harga_beli,
        SUM(CASE WHEN status = 20 THEN t.harga - t.harga_beli ELSE 0 END) AS laba,
        COUNT(CASE WHEN t.status = 20 THEN 1 END) AS total_trx_success,
        COUNT(CASE WHEN t.status <> 20 THEN 1 END) AS total_trx_failed,
        SUM(CASE WHEN status = 20 THEN t.harga_beli ELSE 0 END) AS total_harga_beli_success,
        SUM(CASE WHEN status <> 20 THEN t.harga_beli ELSE 0 END) AS total_harga_beli_failed,
        SUM(CASE WHEN status = 20 THEN t.harga ELSE 0 END) AS total_harga_jual_success,
        SUM(CASE WHEN status <> 20 THEN t.harga ELSE 0 END) AS total_harga_jual_failed
      FROM
          transaksi t
      JOIN
        reseller r ON t.kode_reseller = r.kode
      JOIN
        modul m ON t.kode_modul = m.kode
      WHERE
          CAST(t.tgl_entri AS DATE) BETWEEN ${date} AND ${date}
      GROUP BY
          CAST(t.tgl_entri AS DATE), t.kode_produk, r.nama, m.label, r.keterangan, t.harga, t.harga_beli
      `;

    // Setelah selesai, tutup koneksi
    await close();

    return Response.json(result.recordset);
  } catch (error) {
    console.error("Error:", error);
    return Response.json(error);
  }
}
