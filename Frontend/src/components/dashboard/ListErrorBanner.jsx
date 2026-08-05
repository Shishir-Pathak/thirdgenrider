import { RotateCcw } from "lucide-react";
import DashboardButton from "./DashboardButton";

export default function ListErrorBanner({ message, onRetry }) {
	if (!message) return null;

	return (
		<div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
			{message}
			<DashboardButton
				onClick={onRetry}
				variant="secondary"
				size="sm"
				icon={RotateCcw}
				className="ml-3"
			>
				Retry
			</DashboardButton>
		</div>
	);
}
