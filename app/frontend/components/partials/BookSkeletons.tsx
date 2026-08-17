import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface Props {
	className?: string
}

export default function BooksSkeletons({className}: Props) {
	return (
		<div className={cn("grid grid-cols-4 gap-2 p-2", className)}>
			{Array.from({ length: 6 }).map((_, i) => (
				<Skeleton key={i} className="w-full rounded-xl aspect-square" />
			))}
		</div>
	)
}