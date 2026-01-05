'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

const FAQ: React.FC<FAQProps> = ({ items, title = 'Frequently Asked Questions' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden"
            itemScope
            itemType="https://schema.org/Question"
            itemProp="mainEntity"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-bold text-gray-900 pr-4" itemProp="name">
                {item.question}
              </h3>
              <ChevronDown
                size={20}
                className={`text-gray-400 transition-transform flex-shrink-0 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div
                className="px-6 pb-4 text-gray-700"
                itemScope
                itemType="https://schema.org/Answer"
                itemProp="acceptedAnswer"
              >
                <p itemProp="text">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;

