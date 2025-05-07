export function ReservationList() {
  const reservations = [
    {
      id: 1,
      name: "Rombongan Keluarga Wijaya",
      type: "Pernikahan",
      status: "Lunas",
      checkIn: "05 Mei 2025",
      checkOut: "07 Mei 2025",
      contact: "0812-3456-7890",
      price: "Rp 4.500.000",
    },
    {
      id: 2,
      name: "PT Maju Bersama",
      type: "Perusahaan",
      status: "DP",
      checkIn: "10 Mei 2025",
      checkOut: "12 Mei 2025",
      contact: "0878-9012-3456",
      price: "Rp 7.200.000",
    },
    {
      id: 3,
      name: "Tim Futsal Garuda",
      type: "Perlombaan",
      status: "Baru",
      checkIn: "15 Mei 2025",
      checkOut: "16 Mei 2025",
      contact: "0856-7890-1234",
      price: "Rp 2.800.000",
    },
  ]

  return (
    <>
      {reservations.map((reservation) => (
        <div key={reservation.id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-[#111827]">{reservation.name}</h3>
              <p className="text-sm text-gray-500">{reservation.type}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                reservation.status === "Lunas"
                  ? "bg-[#dcfce7] text-[#166534]"
                  : reservation.status === "DP"
                    ? "bg-[#fef9c3] text-[#854d0e]"
                    : "bg-[#e5e7eb] text-[#374151]"
              }`}
            >
              {reservation.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
            <div>
              <p className="text-gray-500">Check-in</p>
              <p>{reservation.checkIn}</p>
            </div>
            <div>
              <p className="text-gray-500">Check-out</p>
              <p>{reservation.checkOut}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <p className="text-gray-500">Kontak</p>
              <p>{reservation.contact}</p>
            </div>
            <div>
              <p className="text-gray-500">Harga</p>
              <p>{reservation.price}</p>
            </div>
          </div>
          <button className="text-[#4f46e5] text-sm font-medium flex items-center gap-1 hover:underline">
            Lihat Detail
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 5L16 12L9 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </>
  )
}
