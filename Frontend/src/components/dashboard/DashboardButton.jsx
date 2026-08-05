const variants = {
	primary:
		"border-transparent bg-[var(--color-primary)] text-white shadow-sm hover:bg-[var(--color-primary-dark)] focus-visible:outline-[var(--color-primary)]",
	secondary:
		"border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
	danger:
		"border-transparent bg-red-500 text-white shadow-sm hover:bg-red-600 focus-visible:outline-red-500",
	ghost:
		"border-transparent text-slate-500 hover:bg-slate-100 focus-visible:outline-slate-400 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800",
};

const sizes = {
	sm: "min-h-8 rounded-md px-3 py-1.5 text-xs",
	md: "min-h-10 rounded-lg px-4 py-2 text-sm",
	icon: "h-8 w-8 rounded-lg p-1",
};

export default function DashboardButton({
	as: Component = "button",
	variant = "secondary",
	size = "md",
	icon: Icon,
	children,
	className = "",
	type,
	...props
}) {
	const buttonType = Component === "button" ? (type ?? "button") : type;

	return (
		<Component
			type={buttonType}
			className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border font-semibold transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${sizes[size]} ${className}`}
			{...props}
		>
			{Icon && <Icon className={size === "icon" ? "h-5 w-5" : "h-3.5 w-3.5"} />}
			{children}
		</Component>
	);
}
