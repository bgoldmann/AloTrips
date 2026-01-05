'use client';

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...items,
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li
              key={index}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span className={isLast ? 'text-gray-900 font-bold' : 'text-gray-600'} itemProp="name">
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {!isLast && (
                <ChevronRight size={14} className="text-gray-400" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

