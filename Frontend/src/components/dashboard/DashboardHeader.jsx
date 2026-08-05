import { Plus } from "lucide-react";
import DashboardButton from "./DashboardButton";

export default function DashboardHeader({ title, addLabel, onAdd }) {
  const label = addLabel?.replace(/^\+\s*/, "");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h1>
      {addLabel && onAdd && (
        <DashboardButton
          onClick={onAdd}
          variant="primary"
          icon={Plus}
          className="w-fit"
        >
          {label}
        </DashboardButton>
      )}
    </div>
  );
}
