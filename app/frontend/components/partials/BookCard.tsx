import { Book } from "@/interfaces/book";
import { StarIcon } from "lucide-react";

interface BookProps {
	book: Book
}

export const BookCard = ({ book }: BookProps) => {
	return (
		<div className="bg-card rounded-xl p-6 flex flex-col gap-6">
			<div className="w-full flex-center pt-2">
				<img src={book.cover} className="w-1/2 rounded-md" alt="" />
			</div>
			<div>
				<div className="text-subtle">{book.author_names}</div>
				<div>{book.title}</div>
				<div className="flex items-center gap-1 text-sm mt-1">
					<StarIcon fill="var(--subtle)" size={15} stroke="none" />
					<span className="leading-none pt-0.5">{book.average_rating} <span className="text-subtle">({book.ratings_count})</span></span>
				</div>
			</div>
		</div>
	)
}