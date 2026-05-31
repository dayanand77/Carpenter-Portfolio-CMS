import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs font-semibold uppercase tracking-wider mb-8">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && (
              <svg className="w-3 h-3 text-stone-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            )}
            {isLast ? (
              <span className="text-stone-700 truncate max-w-[200px] sm:max-w-xs">{item.label}</span>
            ) : (
              <Link to={item.to} className="text-stone-400 hover:text-amber-700 transition-colors duration-200 shrink-0">{item.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
