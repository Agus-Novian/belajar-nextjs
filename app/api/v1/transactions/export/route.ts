import { connect, close } from "@/lib/db-mssql";
import ExcelJS from "exceljs";
import fs from "fs";
import { join } from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const date = searchParams.get("date");

  if (!date) {
    return new Response("Date is required", { status: 400 });
  }

  try {
    // SUM(t.harga - t.harga_beli) AS laba,
    const pool = await connect();
    const result = await pool.query`
      SELECT
        CAST(t.tgl_entri AS DATE) AS tgl_entri,
        t.kode_produk, 
        r.nama AS nama_reseller,
        m.label AS nama_modul,
        r.keterangan AS nama_crm,
        t.harga as harga_jual,
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

    await close();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transaction");

    // Add headers
    worksheet.addRow([
      "Tanggal Entri",
      "Kode Produk",
      "Nama Reseller",
      "Nama Crm",
      "Harga Jual",
      "Harga Beli",
      "Total Laba",
      "Total Trx Sukses",
      "Total Trx Gagal",
      "Total Harga Beli Sukses",
      "Total Harga Beli Gagal",
      "Total Harga Jual Sukses",
      "Total Harga Jual Gagal",
    ]);

    // Add data
    result.recordset.forEach((row) => {
      worksheet.addRow([
        row.tgl_entri,
        row.kode_produk,
        row.nama_reseller,
        row.nama_crm,
        row.harga_jual,
        row.harga_beli,
        row.laba,
        row.total_trx_success,
        row.total_trx_failed,
        row.total_harga_beli_success,
        row.total_harga_beli_failed,
        row.total_harga_jual_success,
        row.total_harga_jual_failed,
      ]);
    });

    // Create temporary directory
    const tempDir = join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const filePath = join(tempDir, `transaction-${date}.xlsx`);

    // Write workbook to file
    await workbook.xlsx.writeFile(filePath);

    // Read file content
    const fileContent = await fs.promises.readFile(filePath);

    // Delete file
    await fs.promises.unlink(filePath);

    return new Response(fileContent, {
      headers: {
        "Content-Disposition": `attachment; filename=${filePath}`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(error);
  }
}
