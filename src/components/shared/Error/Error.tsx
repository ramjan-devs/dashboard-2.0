import { AlertCircle } from "lucide-react";

interface ErrorProps {
  title?: string;
  error?: unknown;
  refetch?: () => void;
  className?: string;
}
const Error = ({ title="Error", error, refetch, className = "" }: ErrorProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">
        {error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message ||
            "Something went wrong"
          : "Network error occurred"}
      </p>
      {refetch && (
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-[#DB7C3F] text-white rounded-lg hover:bg-[#c46124] transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;