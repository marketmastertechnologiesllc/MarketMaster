export default function Error404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-[20px] text-[#E9D8C8] bg-[#0B1220]">
      <div className="max-w-2xl mx-auto px-6 py-12 bg-[#0B1220] rounded-xl border border-[#11B3AE] shadow-[0_0_32px_rgba(17,179,174,0.3)] text-center">
        <h1 className="mb-[25px] text-6xl sm:text-7xl font-bold text-[#11B3AE]">404</h1>
        <h2 className="mb-[20px] text-2xl sm:text-3xl font-semibold text-[#E9D8C8]">Page not found</h2>
        <p className="text-[#E9D8C8] opacity-80 mb-[21px] text-lg sm:text-xl">
          We&apos;re sorry but the page you were looking for does not exist.
        </p>
        <p className="text-[#E9D8C8] opacity-60 text-sm sm:text-base">
          Please check the URL or navigate back to the homepage.
        </p>
      </div>
    </div>
  );
}
