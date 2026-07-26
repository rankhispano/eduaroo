import Link from 'next/link';
import { ChevronRight } from '@/src/components/icons';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Migas de pan" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-base font-bold text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-slate-600 transition hover:text-slate-950">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-slate-950' : ''}>{item.label}</span>
              )}
              {!isLast ? <ChevronRight className="h-4 w-4" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
