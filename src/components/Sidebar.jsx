const menuItems = [
  { label: '대시보드', path: '/' },
  { label: '광고 관리', path: '/ads' },
  { label: '리포트', path: '/reports' },
  { label: '설정', path: '/settings' },
];

function Sidebar() {
  return (
    <aside className="w-60 bg-gray-900 text-gray-300 flex flex-col shrink-0">
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className="block px-6 py-2.5 text-sm hover:bg-gray-800 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
