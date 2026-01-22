function Header() {
  return (
    <header
      className="shadow-lg"
      style={{ backgroundColor: '#0033A1', color: '#FFD200' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center overflow-hidden">
            <img
              src="/logo_a.png"
              alt="Amhara Bank logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-amhara-yellow">
              Amhara Bank – Excel Upload Portal
            </h1>
            <p className="text-xs md:text-sm text-amhara-yellow/80">
              Secure data onboarding to Oracle from your Excel templates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs md:text-sm text-amhara-yellow/80">
          <span className="hidden md:inline-block h-6 w-px bg-amhara-yellow/40 md:mr-1" />
          <span className="uppercase tracking-[0.18em] font-medium">
            For BI
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header


