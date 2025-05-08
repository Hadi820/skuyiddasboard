import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
        <p className="text-gray-600 mb-6">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan kembali ke halaman yang diizinkan.
        </p>
        <div className="space-y-3">
          <Link href="/clients">
            <Button className="w-full">Halaman Klien</Button>
          </Link>
          <Link href="/kpi-client">
            <Button className="w-full" variant="outline">
              KPI Client
            </Button>
          </Link>
          <Link href="/kpi-admin">
            <Button className="w-full" variant="outline">
              KPI Admin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
