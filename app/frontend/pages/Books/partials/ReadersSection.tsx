import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BookReaders } from "../Show";
import { Skeleton } from "@/components/ui/skeleton";

export const ReadersSectionSkeleton = () => (
	<div className="flex items-center mt-3 justify-center gap-2">
		<div className="flex items-center">
			{Array.from({ length: 3 }).map((_, index) => (
				<Skeleton key={index} className={cn("size-6 rounded-full border border-2 border-background", index > 0 && "-ml-2")}></Skeleton>
			))}
		</div>
		<Skeleton className="w-25 h-3"></Skeleton>
	</div>
)

export default function ReadersSection({ readers }: { readers: BookReaders }) {
	return (
		<div className="flex items-center mt-3 justify-center gap-2">
			<div className="flex items-center">
				{readers.preview_list.map((item, index) => (
					<Avatar key={index} className={cn("grayscale border border-2 border-background size-6", index > 0 && "-ml-2")}>
						<AvatarImage src={item.avatar_url} />
						<AvatarFallback>{item.username[0]}</AvatarFallback>
					</Avatar>
				))}
			</div>
			<div className="text-[13px] text-subtle">{readers.total_count} currently reading</div>
		</div>
	)
}