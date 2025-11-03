import { Link } from "react-router";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-sm mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link to={item.href} className="hover:text-blue-600 font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-semibold">{item.label}</span>
            )}
            {index < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}