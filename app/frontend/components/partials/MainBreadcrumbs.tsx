import { Breadcrumb, cn, createBreadcrumbs } from "@/lib/utils";

export default function MainBreadcrumbs({ breadcrumbs, className }: { breadcrumbs: Breadcrumb[], className?: string }) {
	return (
		<div className={cn("large-container mt-2 mb-4 md:block hidden", className)}>
			{createBreadcrumbs(breadcrumbs)}
		</div>
	)
}