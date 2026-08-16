import { Book } from "@/interfaces/book";
import { Link } from "@inertiajs/react";
import { StarIcon } from "lucide-react";

interface BookProps {
	book: Book
}

export const BookCard = ({ book }: BookProps) => {
	return (
		<div className="bg-card rounded-xl p-6 flex flex-col gap-6 relative hover:bg-black/5 dark:hover:bg-white/10 transition">
			<Link href={book.permalink} className="absolute inset-0 z-1" />
			<div className="w-full flex-center pt-2">
				<img src={book.cover} className="w-3/5 rounded-[2px]" alt={`${book.title}'s cover art`} style={{boxShadow: "-16px 16px 32px rgba(1,1,1,.3)"}} />
			</div>
			<div>
				<div className="text-subtle text-sm">{book.author_names}</div>
				<div>{book.title}</div>
				<div className="flex items-center gap-1 text-sm mt-1">
					<StarIcon fill="var(--subtle)" size={15} stroke="none" />
					<span className="leading-none pt-0.5">{book.average_rating} <span className="text-subtle">({book.ratings_count})</span></span>
				</div>
			</div>
		</div>
	)
}