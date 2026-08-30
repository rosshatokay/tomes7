import { Book } from "@/interfaces/book";
import { Link } from "@inertiajs/react";
import { RatingStars } from "./RatingStars";

interface BookProps {
	book: Book
}

export const BookCard = ({ book }: BookProps) => {

	return (
		<div className="bg-card rounded-xl md:p-5 p-4 flex md:flex-col md:gap-6 gap-4 relative hover:bg-black/5 dark:hover:bg-white/10 transition">
			<Link href={book.permalink || "/"} className="absolute inset-0 z-1" />
			<div className="md:w-full w-fit md:flex md:items-center md:justify-center md:pt-2">
				<img src={book.cover} className="md:w-3/5 md:min-w-initial min-w-20 w-20 rounded-[2px]" alt={`${book.title}'s cover art`} style={{ boxShadow: "-16px 16px 32px rgba(1,1,1,.3)" }} />
			</div>
			<div className="flex flex-col h-full md:py-0 py-3">
				<h3>{book.title}</h3>
				<div className="text-subtle text-sm">{book.author_names}</div>
				<div className="flex items-center gap-1 text-sm md:mt-1 mt-auto">
					{/* <StarIcon fill="var(--subtle)" size={15} stroke="none" /> */}
					<RatingStars rating={book.average_rating} />
					<span className="leading-none pt-0.5"><span className="text-subtle">({book.ratings_count})</span></span>
				</div>
			</div>
		</div>
	)
}