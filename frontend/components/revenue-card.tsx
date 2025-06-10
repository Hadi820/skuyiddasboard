export function RevenueCard() {
  return (
    <div className="bg-[#4f46e5] text-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-white/80">Harga Jadi</h3>
          <p className="mt-1 text-2xl font-semibold">Rp 28.500.000</p>
          <p className="mt-1 text-sm text-white/80">12% dari bulan lalu</p>
        </div>
        <div className="p-2 bg-white/20 rounded-full">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
