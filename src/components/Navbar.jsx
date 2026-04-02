function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-xl font-bold text-gray-800">Ad Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Admin</span>
      </div>
    </header>
  );
}

export default Navbar;
