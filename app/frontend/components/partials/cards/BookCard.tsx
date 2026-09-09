import { Book } from "@/interfaces/book";
import { Link } from "@inertiajs/react";
import { RatingStars } from "../RatingStars";
import { cn, useIsMobile } from "@/lib/utils";

interface BookProps {
	book: Book
	isMobileForced?: boolean
}

export const BookCard = ({ book, isMobileForced }: BookProps) => {
	const isMobile = isMobileForced || useIsMobile()

	return (
		<div className={cn("bg-card rounded-xl flex relative hover:bg-black/10 dark:hover:bg-white/10 transition", isMobile ? "p-4 gap-4" : "p-5 flex-col gap-6")}>
			<Link href={book.permalink || "/"} className="absolute inset-0 z-1" />
			<div className={cn("w-fit", !isMobile && "w-full flex items-center justify-center pt-2")}>
				<img src={book.cover}
					className={cn("min-w-20 w-20 rounded-sm aspect-book object-cover", !isMobile && "w-3/5 min-w-initial")}
					alt={`${book.title}'s cover art`}
					style={{ boxShadow: "-16px 16px 32px rgba(1,1,1,.2)" }}
				/>
			</div>
			<div className="h-full">
				<div className={cn("flex flex-col h-full py-3", !isMobile && "py-0")}>
					<h3 className="truncate">{book.title}</h3>
					<div className="truncate text-subtle text-sm mt-0.5 mb-2">{book.author_names}</div>
					{/* <div className={cn("flex items-center gap-1 text-sm mt-auto", isMobile ? "mt-auto" : "mt-1")}> */}
					<div className={cn("flex items-center gap-1 text-sm mt-auto")}>
						<RatingStars rating={book.average_rating} />
						<span className="leading-none pt-0.5">
							<span className="text-subtle">({book.ratings_count})</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}