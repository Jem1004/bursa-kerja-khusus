"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface LokerDetailProps {
  loker: {
    id: string;
    judul: string;
    namaPerusahaan: string;
    logoPerusahaan: string | null;
    lokasi: string;
    deskripsi: string;
    kualifikasi: string;
    caraMelamar: string;
    batasWaktu: Date;
    createdAt: Date;
  };
}

export default function LokerDetail({ loker }: LokerDetailProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Button>
      </Link>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {loker.logoPerusahaan && (
              <div className="flex-shrink-0 w-24 h-24 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={loker.logoPerusahaan}
                  alt={`Logo ${loker.namaPerusahaan}`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-poppins font-bold text-2xl sm:text-3xl text-neutral-900 mb-2">
                {loker.judul}
              </h1>
              <p className="text-lg text-neutral-700 mb-4">
                {loker.namaPerusahaan}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{loker.lokasi}</span>
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Batas: {formatDate(loker.batasWaktu)}</span>
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Deskripsi */}
          <div>
            <h2 className="font-poppins font-semibold text-xl text-neutral-900 mb-3">
              Deskripsi Pekerjaan
            </h2>
            <div className="text-neutral-700 whitespace-pre-wrap">
              {loker.deskripsi}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-neutral-200" />

          {/* Kualifikasi */}
          <div>
            <h2 className="font-poppins font-semibold text-xl text-neutral-900 mb-3">
              Kualifikasi
            </h2>
            <div className="text-neutral-700 whitespace-pre-wrap">
              {loker.kualifikasi}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-neutral-200" />

          {/* Cara Melamar */}
          <div>
            <h2 className="font-poppins font-semibold text-xl text-neutral-900 mb-3">
              Cara Melamar
            </h2>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="text-neutral-700 whitespace-pre-wrap">
                {loker.caraMelamar}
              </div>
            </div>
          </div>

          {/* Info Tambahan */}
          <div className="bg-neutral-50 rounded-lg p-4 text-sm text-neutral-600">
            <p>
              Lowongan ini dipublikasikan pada {formatDateTime(loker.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
