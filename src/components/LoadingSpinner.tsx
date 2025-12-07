'use client';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">Processing...</p>
    </div>
  );
}