export function BookingSchedule() {
  const bookings = [
    {
      id: 1,
      date: "01 Mei 2025",
      client: "Agus Wijaya",
      phone: "0812-3456-7890",
      checkIn: "05 Mei 2025",
      checkOut: "07 Mei 2025",
      time: "14:00 WIB",
      status: "Lunas",
    },
    {
      id: 2,
      date: "02 Mei 2025",
      client: "Dewi Sartika",
      phone: "0878-9012-3456",
      checkIn: "10 Mei 2025",
      checkOut: "12 Mei 2025",
      time: "10:00 WIB",
      status: "DP",
    },
    {
      id: 3,
      date: "02 Mei 2025",
      client: "Rudi Hartono",
      phone: "0856-7890-1234",
      checkIn: "15 Mei 2025",
      checkOut: "16 Mei 2025",
      time: "09:00 WIB",
      status: "Baru",
    },
    {
      id: 4,
      date: "03 Mei 2025",
      client: "Nina Suryani",
      phone: "0821-3456-7890",
      checkIn: "20 Mei 2025",
      checkOut: "22 Mei 2025",
      time: "13:00 WIB",
      status: "DP",
    },
    {
      id: 5,
      date: "03 Mei 2025",
      client: "Bambang Suharto",
      phone: "0812-9876-5432",
      checkIn: "25 Mei 2025",
      checkOut: "27 Mei 2025",
      time: "11:00 WIB",
      status: "Lunas",
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Booking</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Client</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No HP</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-500">{booking.date}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{booking.client}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{booking.phone}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{booking.checkIn}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{booking.checkOut}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{booking.time}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                    booking.status === "Lunas"
                      ? "bg-[#dcfce7] text-[#166534]"
                      : booking.status === "DP"
                        ? "bg-[#fef9c3] text-[#854d0e]"
                        : "bg-[#e5e7eb] text-[#374151]"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
