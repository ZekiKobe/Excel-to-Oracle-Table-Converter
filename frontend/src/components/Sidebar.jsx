function Sidebar() {
  return (
    <aside className="space-y-4 md:space-y-6">
      <div className="bg-white/80 backdrop-blur border border-amhara-blue/10 rounded-3xl shadow-lg p-6">
        <h3 className="text-base md:text-lg font-semibold text-amhara-blue mb-3">
          Upload guidelines
        </h3>
        <ul className="space-y-2 text-xs md:text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amhara-blue" />
            Use only <span className="font-medium ml-1">.xlsx</span> or <span className="font-medium">.xls</span> files.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amhara-blue" />
            Required columns: <span className="font-medium ml-1">col1, col2, col3</span>.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amhara-blue" />
            Rows with missing required values may be rejected by the server.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amhara-blue" />
            Ensure you are connected to the corporate network or VPN.
          </li>
        </ul>
      </div>

      <div className="bg-amhara-blue text-amhara-yellow rounded-3xl shadow-lg p-6 space-y-3">
        <h3 className="text-base md:text-lg font-semibold">
          Status & security
        </h3>
        <p className="text-xs md:text-sm text-amhara-yellow/90">
          Files are processed securely and only used to insert data into the configured Oracle
          database. No file is permanently stored on the server after processing.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar


