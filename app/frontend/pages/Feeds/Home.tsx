import { BookCard } from "@/components/partials/BookCard";
import { Button } from "@/components/ui/button";
import { Book } from "@/interfaces/book";

interface HomePageProps {
	currently_reading: Book[]
}

export default function HomePage({ currently_reading }: HomePageProps) {
	return (
		<>
			<div className="large-container pt-6 flex-center flex-col h-[30vh] min-h-50">
				<h1 className="text-5xl mb-4">Library</h1>
				<p className="text-subtle">Your collection of books</p>
			</div>
			<div className="large-container">
				<div className="flex gap-2">
					<Button variant={"secondary"} className={"rounded-full text-[15px]"}>Reading</Button>
					<Button variant={"ghost"} className={"rounded-full text-[15px]"}>Saved</Button>
				</div>
			</div>
			<div className="pb-6 mt-2 px-2 grid grid-cols-4 gap-2">
				{currently_reading.map((book, index) => <BookCard key={index} book={book} />)}
			</div>
		</>
	)
}