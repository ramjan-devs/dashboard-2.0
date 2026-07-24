/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { Phone, AlertCircle, ChevronDown } from "lucide-react";

interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

const COUNTRIES: CountryCode[] = [
  { code: "+255", flag: "🇹🇿", name: "Tanzania" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+256", flag: "🇺🇬", name: "Uganda" },
  { code: "+250", flag: "🇷🇼", name: "Rwanda" },
  { code: "+257", flag: "🇧🇮", name: "Burundi" },
  { code: "+252", flag: "🇸🇴", name: "Somalia" },
  { code: "+249", flag: "🇸🇩", name: "Sudan" },
  { code: "+211", flag: "🇸🇸", name: "South Sudan" },
];

interface PhoneInputProps {
  name: string;
  control: any;
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export default function PhoneInput({
  name,
  control,
  label = "Phone Number",
  required = true,
  error,
  placeholder = "712 000 000",
}: PhoneInputProps) {
  const value = useWatch({
    control,
    name,
  }) || "";

  const matched = COUNTRIES.find((c) => value.startsWith(c.code));
  const currentCountry = matched ? matched.code : "+255";
  const currentLocalNum = matched ? value.substring(matched.code.length) : value;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur } }) => {
        const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          const newCode = e.target.value;
          onChange(`${newCode}${currentLocalNum}`);
        };

        const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let num = e.target.value;
          num = num.replace(/[^\d]/g, "");
          const cleanedNum = num.replace(/^0+/, "");
          onChange(`${currentCountry}${cleanedNum}`);
        };

        return (
          <div className="space-y-1.5 w-full">
            {label && (
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                {label} {required && <span className="text-red-400">*</span>}
              </label>
            )}

            <div className="flex gap-2.5 items-center w-full">
              {/* Country Code Select Dropdown */}
              <div className="relative shrink-0 w-[110px]">
                <select
                  value={currentCountry}
                  onChange={handleCountryChange}
                  className={`w-full pl-3 pr-8 py-2.5 bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-4 transition-all text-sm font-semibold appearance-none cursor-pointer ${
                    error
                      ? "border-red-200 focus:ring-red-50 focus:bg-red-50/10"
                      : "border-gray-200 focus:ring-blue-50 focus:bg-white"
                  }`}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Local Number Input Container */}
              <div className="relative flex-1 group">
                <Phone
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    error ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"
                  }`}
                />
                <input
                  type="text"
                  value={currentLocalNum}
                  onChange={handleNumberChange}
                  onBlur={onBlur}
                  placeholder={placeholder}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-4 transition-all text-sm font-medium ${
                    error
                      ? "border-red-200 focus:ring-red-50 focus:bg-red-50/10"
                      : "border-gray-200 focus:ring-blue-50 focus:bg-white"
                  }`}
                />
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                <AlertCircle size={10} /> {error}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
