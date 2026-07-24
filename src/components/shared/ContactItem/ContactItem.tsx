import React from "react";

interface ContactItemProps {
  label: string;
  value: string | number;
}

const ContactItem = ({ label, value }: ContactItemProps) => {
  return (
    <div className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
};

export default ContactItem;
