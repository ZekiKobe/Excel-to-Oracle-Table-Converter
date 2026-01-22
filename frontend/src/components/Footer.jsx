function Footer() {
  return (
    <footer className="bg-transparent pb-4">
      <div className="max-w-6xl mx-auto px-4 text-center text-xs md:text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()}{' '}
          <span className="font-semibold text-amhara-blue">Amhara Bank</span>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer


