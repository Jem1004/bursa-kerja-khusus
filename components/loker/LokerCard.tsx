import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface LokerCardProps {
  id: string;
  judul: string;
  namaPerusahaan: string;
  logoPerusahaan?: string | null;
  lokasi: string;
  deskripsi: string;
  batasWaktu: Date;
}

export default function LokerCard({
  id,
  judul,
  namaPerusahaan,
  logoPerusahaan,
  lokasi,
  deskripsi,
  batasWaktu,
}: LokerCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-4">
          {logoPerusahaan && (
            <div className="flex-shrink-0 w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={logoPerusahaan}
                alt={`Logo ${namaPerusahaan}`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-poppins font-semibold text-lg text-neutral-900 mb-1 line-clamp-2">
              {judul}
            </h3>
            <p className="text-neutral-600 text-sm">{namaPerusahaan}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-neutral-700 text-sm line-clamp-3 mb-4">
          {deskripsi}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
          <span className="flex items-center gap-1">
            <span>📍</span>
            <span>{lokasi}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>⏰</span>
            <span>Batas: {formatDate(batasWaktu)}</span>
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/loker/${id}`} className="w-full">
          <Button className="w-full">Lihat Detail</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
