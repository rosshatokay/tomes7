import { BookCard } from "@/components/partials/BookCard";
import { Button } from "@/components/ui/button";
import { Book } from "@/interfaces/book";
import BaseLayout from "@/layouts/BaseLayout";
import { Link } from "@inertiajs/react";

interface HomePageProps {
	currently_reading: Book[]
}

export default function HomePage({ currently_reading }: HomePageProps) {
	console.log(currently_reading)
	return (
		<>
			<div className="large-container pt-6 flex-center flex-col h-[30vh]">
				<h1 className="text-5xl">Library</h1>
			</div>
			<div className="large-container">
				<div className="flex gap-2 mt-6">
					<Button variant={"secondary"} className={"rounded-full text-[15px]"}>Reading</Button>
					<Button variant={"ghost"} className={"rounded-full text-[15px]"}>Saved</Button>
				</div>
			</div>
			<div className="pb-6 mt-4 px-2 grid grid-cols-4 gap-2">
				{currently_reading.map(book => <BookCard book={book} />)}
			</div>
		</>
	)
}