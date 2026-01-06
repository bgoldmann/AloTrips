'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface FlexibleDatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null, flexibleDays?: number) => void;
  showEndDate?: boolean;
  error?: string;
  flexibleDays?: number; // ±N days flexibility
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const FlexibleDatePicker: React.FC<FlexibleDatePickerProps> = ({ 
  startDate, 
  endDate, 
  onChange, 
  showEndDate = true,
  error,
  flexibleDays = 3
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFlexibleDays, setSelectedFlexibleDays] = useState(flexibleDays);
  const [showFlexibleOptions, setShowFlexibleOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const isDateInFlexibleRange = (date: Date, baseDate: Date | null, days: number): boolean => {
    if (!baseDate) return false;
    const diff = Math.abs((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= days;
  };

  const handleDateClick = (day: number, monthOffset: number = 0) => {
    const viewDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);

    if (!showEndDate) {
      onChange(clickedDate, null, selectedFlexibleDays);
      setIsOpen(false);
    } else if (!startDate || (startDate && endDate) || clickedDate < startDate) {
      onChange(clickedDate, null, selectedFlexibleDays);
    } else {
      onChange(startDate, clickedDate, selectedFlexibleDays);
      setIsOpen(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderMonth = (monthOffset: number) => {
    const viewDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      
      const isSelectedStart = startDate && date.toDateString() === startDate.toDateString();
      const isSelectedEnd = endDate && date.toDateString() === endDate.toDateString();
      const isInRange = startDate && endDate && date > startDate && date < endDate;
      const isToday = new Date().toDateString() === date.toDateString();
      const isDisabled = date < new Date(new Date().setHours(0,0,0,0));
      
      // Check if date is in flexible range
      const isFlexibleStart = showFlexibleOptions && startDate && isDateInFlexibleRange(date, startDate, selectedFlexibleDays);
      const isFlexibleEnd = showFlexibleOptions && endDate && isDateInFlexibleRange(date, endDate, selectedFlexibleDays);

      let classes = "h-9 w-9 flex items-center justify-center text-sm rounded-full cursor-pointer transition-all relative z-10 mx-auto ";
      
      if (isDisabled) {
        classes += "text-gray-300 cursor-not-allowed";
      } else if (isSelectedStart || isSelectedEnd) {
        classes += "bg-orange-600 text-white font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 scale-105";
      } else if (isFlexibleStart || isFlexibleEnd) {
        classes += "bg-orange-100 text-orange-700 font-semibold border-2 border-orange-300 border-dashed";
      } else if (isInRange) {
        classes += "bg-orange-50 text-orange-700 rounded-none w-full font-medium";
      } else {
        classes += "text-gray-700 hover:bg-gray-100 hover:text-orange-600";
        if (isToday) classes += " font-bold text-orange-600 ring-2 ring-orange-200";
      }

      const isRangeStart = isSelectedStart && endDate;
      const isRangeEnd = isSelectedEnd && startDate;

      days.push(
        <div key={day} className="relative p-0.5 w-full aspect-square flex items-center justify-center">
            {isInRange && <div className="absolute inset-y-1 left-0 right-0 bg-orange-50 z-0" />}
            {isRangeStart && <div className="absolute inset-y-1 left-1/2 right-0 bg-orange-50 z-0" />}
            {isRangeEnd && <div className="absolute inset-y-1 left-0 right-1/2 bg-orange-50 z-0" />}
            
            <button 
                onClick={(e) => { e.stopPropagation(); !isDisabled && handleDateClick(day, monthOffset); }} 
                disabled={isDisabled}
                className={classes}
                title={isFlexibleStart || isFlexibleEnd ? `Flexible date (±${selectedFlexibleDays} days)` : ''}
            >
                {day}
            </button>
        </div>
      );
    }

    return (
      <div className="w-64 p-2 select-none">
        <div className="text-center font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
           <span className="bg-orange-50 px-3 py-1 rounded-full text-orange-800 text-xs uppercase tracking-wider">{MONTHS[month]} {year}</span>
        </div>
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => <div key={d} className="text-center text-xs text-gray-400 font-bold">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1 place-items-center">
          {days}
        </div>
      </div>
    );
  };

  const nextMonth = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); };
  const prevMonth = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); };

  return (
    <div className="relative group w-full" ref={containerRef}>
        <label className="absolute left-11 top-3 text-xs text-gray-500 font-bold uppercase tracking-wider group-focus-within:text-orange-600 transition-colors z-10 pointer-events-none">Dates</label>
        <CalendarIcon className="absolute left-4 top-4.5 text-gray-400 z-10 pointer-events-none group-focus-within:text-orange-500 transition-colors" size={20} />
        
        <div 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full h-16 pl-11 pt-5 rounded-2xl border ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
            } cursor-pointer flex items-center text-gray-900 font-bold text-lg overflow-hidden whitespace-nowrap transition-all shadow-inner ${
              isOpen ? 'border-orange-500 ring-4 ring-orange-100 bg-white' : 'hover:border-orange-300 hover:bg-white'
            }`}
        >
             {startDate ? (
               <span className="flex items-center gap-2">
                 {formatDate(startDate)} 
                 {showEndDate && (
                   <>
                     <span className="text-orange-300 mx-1">→</span> 
                     {endDate ? formatDate(endDate) : <span className="text-gray-400 font-normal text-base">Check-out</span>}
                   </>
                 )}
                 {selectedFlexibleDays > 0 && (
                   <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                     <Sparkles size={12} /> ±{selectedFlexibleDays} days
                   </span>
                 )}
               </span>
             ) : (
               <span className="text-gray-400 font-normal text-base">Select {showEndDate ? 'dates' : 'date'}</span>
             )}
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
        )}

        {isOpen && (
            <div className="absolute top-20 left-0 z-50 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-8 animate-in fade-in zoom-in-95 duration-200">
                <button onClick={prevMonth} className="absolute left-4 top-4 p-2 hover:bg-orange-50 rounded-full z-20 text-gray-500 hover:text-orange-600 transition-colors"><ChevronLeft size={20}/></button>
                <button onClick={nextMonth} className="absolute right-4 top-4 p-2 hover:bg-orange-50 rounded-full z-20 text-gray-500 hover:text-orange-600 transition-colors"><ChevronRight size={20}/></button>
                
                {/* Flexible Days Selector */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowFlexibleOptions(!showFlexibleOptions); }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-full text-sm font-bold text-orange-700 transition-colors"
                  >
                    <Sparkles size={14} />
                    Flexible: ±{selectedFlexibleDays} days
                  </button>
                  {showFlexibleOptions && (
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 min-w-[200px]">
                      <div className="text-xs font-bold text-gray-500 mb-2 px-2">Flexibility</div>
                      {[0, 1, 2, 3, 5, 7].map(days => (
                        <button
                          key={days}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFlexibleDays(days);
                            if (startDate || endDate) {
                              onChange(startDate, endDate, days);
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedFlexibleDays === days
                              ? 'bg-orange-600 text-white font-bold'
                              : 'hover:bg-orange-50 text-gray-700'
                          }`}
                        >
                          {days === 0 ? 'Exact dates' : `±${days} days`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {renderMonth(0)}
                <div className="hidden md:block border-l border-gray-100"></div>
                <div className="hidden md:block">
                    {renderMonth(1)}
                </div>
            </div>
        )}
    </div>
  );
};

export default FlexibleDatePicker;

