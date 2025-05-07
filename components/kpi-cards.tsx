export function KpiCards() {
  const kpis = [
    {
      id: 1,
      title: "Reservasi Bulan Ini",
      value: "18",
      icon: (
        <div className="p-2 bg-blue-100 rounded-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
              stroke="#4f46e5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M16 2V6" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 2V6" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10H21" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ),
    },
    {
      id: 2,
      title: "Pembayaran Lunas",
      value: "8",
      icon: (
        <div className="p-2 bg-green-100 rounded-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#16a34a"
              strokeWidth="2"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 3,
      title: "Menunggu Pelunasan",
      value: "7",
      icon: (
        <div className="p-2 bg-yellow-100 rounded-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#ca8a04"
              strokeWidth="2"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 4,
      title: "Reservasi Baru",
      value: "3",
      icon: (
        <div className="p-2 bg-blue-100 rounded-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V15" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12H15" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#2563eb"
              strokeWidth="2"
            />
          </svg>
        </div>
      ),
    },
  ]

  return (
    <>
      {kpis.map((kpi) => (
        <div key={kpi.id} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            {kpi.icon}
            <h3 className="text-sm font-medium text-gray-500">{kpi.title}</h3>
          </div>
          <p className="text-2xl font-semibold">{kpi.value}</p>
        </div>
      ))}
    </>
  )
}
