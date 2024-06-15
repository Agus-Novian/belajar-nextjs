"use client";

import { ButtonLoading } from "@/components/button-loading";
import { DatePicker } from "@/components/date-picker";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatRupiah } from "@/lib/utils";
import { useState } from "react";

interface Report {
  tgl_entri: string;
  kode_produk: string;
  nama_reseller: string;
  nama_modul: string;
  nama_crm?: string;
  total_trx_success: number;
  total_trx_failed: number;
  harga_beli: number;
  harga: number;
  laba: number;
  total_harga_beli_success: number;
  total_harga_beli_failed: number;
  total_harga_jual_success: number;
  total_harga_jual_failed: number;
}

export default function TableReport() {
  const today = new Date();
  const formattedDate =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  const [data, setData] = useState<Report[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(formattedDate);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (date: Date) => {
    setSelectedDate(
      `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
    ); // Format date as YYYY-MM-DD
  };

  const handleSearch = () => {
    if (selectedDate) {
      console.log(selectedDate);
      fetchData(selectedDate);
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoading(true);

      const baseUrl = window.location.origin;
      const response = await fetch(
        `${baseUrl}/api/v1/transactions/export?date=${selectedDate}`
      );
      if (!response.ok) {
        throw new Error("Failed to export data to Excel");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions-${selectedDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  async function fetchData(date: string) {
    try {
      setLoading(true);

      const baseUrl = window.location.origin;
      const response = await fetch(
        `${baseUrl}/api/v1/transactions?date=${date}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading back to false after fetching data
    }
  }

  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="grid grid-cols-1 sm:grid-cols-2 items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Recent transactions from your store.
          </CardDescription>
        </div>
        {/* <div className="ml-auto flex gap-1 items-center"> */}
        <div className="flex flex-col sm:flex-row xl:flex-row xl:ml-auto gap-2 items-center w-full xl:w-auto">
          <DatePicker onChange={handleDateChange} />
          {loading ? (
            <ButtonLoading />
          ) : (
            <Button onClick={handleSearch} className="ml-2">
              Search
            </Button>
          )}
          {loading ? (
            <ButtonLoading />
          ) : (
            <Button onClick={handleExportExcel} className="ml-2">
              Export Excel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal Entri</TableHead>
                <TableHead>Kode Produk</TableHead>
                <TableHead>Nama Reseller</TableHead>
                <TableHead>Nama Crm</TableHead>
                <TableHead>Total Trx Sukses</TableHead>
                <TableHead>Total Trx Gagal</TableHead>
                <TableHead>Harga Beli</TableHead>
                <TableHead>Harga Jual</TableHead>
                <TableHead>Total Laba</TableHead>
                <TableHead>Total Harga Beli Sukses</TableHead>
                <TableHead>Total Harga Beli Gagal</TableHead>
                <TableHead>Total Harga Jual Sukses</TableHead>
                <TableHead>Total Harga Jual Gagal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center">
                    Data tidak ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={`${item.tgl_entri}-${index}`}>
                    <TableCell>{formatDate(item.tgl_entri)}</TableCell>
                    <TableCell>{item.kode_produk}</TableCell>
                    <TableCell>{item.nama_reseller}</TableCell>
                    <TableCell>{item.nama_crm}</TableCell>
                    <TableCell>{item.total_trx_success}</TableCell>
                    <TableCell>{item.total_trx_failed}</TableCell>
                    <TableCell>{formatRupiah(item.harga_beli)}</TableCell>
                    <TableCell>{formatRupiah(item.harga)}</TableCell>
                    <TableCell>{formatRupiah(item.laba)}</TableCell>
                    <TableCell>
                      {formatRupiah(item.total_harga_beli_success)}
                    </TableCell>
                    <TableCell>
                      {formatRupiah(item.total_harga_beli_failed)}
                    </TableCell>
                    <TableCell>
                      {formatRupiah(item.total_harga_jual_success)}
                    </TableCell>
                    <TableCell>
                      {formatRupiah(item.total_harga_jual_failed)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
