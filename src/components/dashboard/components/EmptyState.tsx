import { ChartNoAxesColumn } from "lucide-react";

export const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-8 px-4 text-gray-400">
    <ChartNoAxesColumn className="w-8 h-8 mb-3 opacity-50" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);
