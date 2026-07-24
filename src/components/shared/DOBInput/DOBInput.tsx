/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, AlertCircle } from "lucide-react";

interface DOBInputProps {
  name?: string;
  control?: any;
  label?: string;
  required?: boolean;
  error?: string;
  // Fallback support for standard state (non-react-hook-form)
  value?: string; // YYYY-MM-DD
  onChange?: (val: string) => void;
}

const MONTHS = [
  { value: 0, label: "Jan" },
  { value: 1, label: "Feb" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Apr" },
  { value: 4, label: "May" },
  { value: 5, label: "Jun" },
  { value: 6, label: "Jul" },
  { value: 7, label: "Aug" },
  { value: 8, label: "Sep" },
  { value: 9, label: "Oct" },
  { value: 10, label: "Nov" },
  { value: 11, label: "Dec" },
];

export default function DOBInput({
  name,
  control,
  label = "Date of Birth",
  required = true,
  error,
  value,
  onChange,
}: DOBInputProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 110 }, (_, i) => currentYear - i);

  // State when used as a standard controlled component
  const [localVal, setLocalVal] = useState(value || "");

  const formatDateToDisplay = (dateStr: string) => {
    if (!dateStr) return "DD-MM-YYYY";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD-MM-YYYY
    }
    return "DD-MM-YYYY";
  };

  const renderDatePicker = (
    currentValue: string,
    handleValueChange: (val: string) => void,
    validationError?: string
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [placement, setPlacement] = useState<{ y: "top" | "bottom"; x: "left" | "right" }>({ y: "bottom", x: "left" });

    // Get currently viewed month/year in the calendar
    const initialViewDate = currentValue ? new Date(currentValue) : new Date();
    const [viewMonth, setViewMonth] = useState(initialViewDate.getMonth());
    const [viewYear, setViewYear] = useState(initialViewDate.getFullYear());

    // Close popover when clicking outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Calculate dynamic placement to prevent popover cutoff
    useEffect(() => {
      if (isOpen && popoverRef.current) {
        const rect = popoverRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        
        // If there's less than 320px below the input trigger, open upwards
        const y = spaceBelow < 320 ? "top" : "bottom";
        const x = rect.left > window.innerWidth / 2 ? "right" : "left";
        
        setPlacement({ y, x });
      }
    }, [isOpen]);

    // Sync view date if currentValue changes from outside
    useEffect(() => {
      if (currentValue) {
        const d = new Date(currentValue);
        if (!isNaN(d.getTime())) {
          setViewMonth(d.getMonth());
          setViewYear(d.getFullYear());
        }
      }
    }, [currentValue]);

    // Calendar generation math
    const getDaysInMonth = (month: number, year: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
      return new Date(year, month, 1).getDay(); // Sunday = 0, Monday = 1...
    };

    const totalDays = getDaysInMonth(viewMonth, viewYear);
    const firstDay = getFirstDayOfMonth(viewMonth, viewYear);

    interface DayCell {
      day: number;
      isCurrentMonth: boolean;
    }

    const dayCells: DayCell[] = [];

    // Get trailing days from previous month
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const prevMonthTotalDays = getDaysInMonth(prevMonth, prevYear);

    for (let i = firstDay - 1; i >= 0; i--) {
      dayCells.push({
        day: prevMonthTotalDays - i,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      dayCells.push({
        day: i,
        isCurrentMonth: true,
      });
    }

    const handlePrevMonth = () => {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((y) => y - 1);
      } else {
        setViewMonth((m) => m - 1);
      }
    };

    const handleNextMonth = () => {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      } else {
        setViewMonth((m) => m + 1);
      }
    };

    const isFutureDate = (dayNum: number) => {
      const checkDate = new Date(viewYear, viewMonth, dayNum);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return checkDate > today;
    };

    const handleDayClick = (dayNum: number) => {
      if (isFutureDate(dayNum)) return;

      const y = viewYear;
      const m = String(viewMonth + 1).padStart(2, "0");
      const d = String(dayNum).padStart(2, "0");
      const combined = `${y}-${m}-${d}`; // YYYY-MM-DD

      handleValueChange(combined);
      setIsOpen(false);
    };

    const isSelected = (dayNum: number) => {
      if (!currentValue) return false;
      const parts = currentValue.split("-");
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        return y === viewYear && m === viewMonth && d === dayNum;
      }
      return false;
    };

    return (
      <div className="space-y-1.5 w-full relative" ref={popoverRef}>
        {label && (
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
            {label} {required && <span className="text-red-400">*</span>}
          </label>
        )}

        {/* Input Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 px-4 py-3 bg-gray-50/30 border rounded-2xl focus:outline-none focus:ring-4 transition-all text-sm font-semibold select-none cursor-pointer ${
            validationError
              ? "border-red-200 focus:ring-red-50 focus:bg-red-50/10"
              : "border-gray-200 focus:ring-blue-50 focus:bg-white"
          }`}
        >
          <CalendarIcon
            className={`w-4 h-4 shrink-0 transition-colors ${
              validationError ? "text-red-500" : "text-gray-900"
            }`}
          />
          <span className="text-gray-950 font-bold">
            {formatDateToDisplay(currentValue)}
          </span>
        </button>

        {/* Calendar Popover */}
        {isOpen && (
          <div className={`absolute w-[280px] bg-white border border-gray-100 rounded-[20px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] z-50 animate-in fade-in zoom-in-95 duration-150 ${
            placement.y === "top" ? "bottom-full mb-2 origin-bottom" : "mt-2 origin-top"
          } ${
            placement.x === "right" ? "right-0" : "left-0"
          }`}>
            {/* Calendar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-gray-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {/* Month Select */}
                <div className="relative flex items-center">
                  <select
                    value={viewMonth}
                    onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                    className="appearance-none pl-2.5 pr-7 py-1 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
                </div>

                {/* Year Select */}
                <div className="relative flex items-center">
                  <select
                    value={viewYear}
                    onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                    className="appearance-none pl-2.5 pr-7 py-1 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-gray-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-0.5 text-center mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                <span key={dayName} className="text-xs font-semibold text-gray-400">
                  {dayName}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {dayCells.map((cell, index) => {
                const { day, isCurrentMonth } = cell;
                const selected = isCurrentMonth && isSelected(day);
                const isFuture = isCurrentMonth && isFutureDate(day);
                const isMuted = !isCurrentMonth || isFuture;

                return (
                  <button
                    type="button"
                    key={`day-${index}`}
                    onClick={() => !isMuted && handleDayClick(day)}
                    disabled={isMuted}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-full transition-all ${
                      selected
                        ? "bg-gray-100 text-gray-900 font-bold"
                        : isMuted
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {validationError && (
          <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
            <AlertCircle size={10} /> {validationError}
          </p>
        )}
      </div>
    );
  };

  // If react-hook-form control is provided
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: formOnChange, value: formValue } }) => {
          return renderDatePicker(formValue || "", formOnChange, error);
        }}
      />
    );
  }

  // Fallback: Controlled component state
  useEffect(() => {
    if (value !== undefined) {
      setLocalVal(value);
    }
  }, [value]);

  const handleLocalChange = (newVal: string) => {
    setLocalVal(newVal);
    if (onChange) {
      onChange(newVal);
    }
  };

  return renderDatePicker(localVal, handleLocalChange, error);
}
