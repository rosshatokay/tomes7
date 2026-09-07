import { BookCard } from "@/components/partials/cards/BookCard";
import MainHeader from "@/components/partials/MainHeader";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Book } from "@/interfaces/book";
import { InfiniteScroll, Link, usePage } from "@inertiajs/react";
import { InfoIcon } from "lucide-react";

interface LibraryPageProps {
	currentTab: "reading" | "following" | "saved"
	books: Book[]
}

export default function MyBooksPage({ currentTab, books }: LibraryPageProps) {
	const { url } = usePage()

	const searchParams = new URLSearchParams(url.split("?")[1])
	const activeTab = searchParams.get("tab") || "reading"

	const tabs = [
		{ label: "Reading", value: "reading", path: "?tab=reading" },
		{ label: "Following", value: "following", path: "?tab=following" },
		{ label: "Saved", value: "saved", path: "?tab=saved" },
	]

	const formatEmptyDescriptionByTab = () => {
		if (activeTab === "reading") return "You aren't reading any books currently. Books you start reading will appear here."
		if (activeTab === "following") return "You aren't following any authors with published books yet."
		if (activeTab === "saved") return "You haven't saved a book yet."
	}

	return (
		<>
			<MainHeader title="Home" description="Your collection of books" />
			<div className="large-container">
				<div className="flex gap-4 items-center justify-between">
					<div className="scroll-fade-x scroll-fade-24 scrollbar-none overflow-x-auto">
						<div className="flex gap-1 min-w-0 w-max">
							{tabs.map(tab => {
								const isActive = activeTab === tab.value

								return (
									<Button
										key={tab.value}
										variant={isActive ? "default" : "secondary"}
										className="rounded-full text-[15px]"
										nativeButton={false}
										render={
											<Link
												href={tab.path}
												preserveState
												preserveScroll
											/>
										}
									>
										{tab.label}
									</Button>
								)
							})}
						</div>
					</div>
					<div className="text-sm text-subtle whitespace-nowrap">Showing {books.length} {books.length === 1 ? "book" : "books"}</div>
				</div>
			</div>
			<InfiniteScroll data="books">
				{books?.length === 0 ? (
					<div className="large-container mt-4">
						<Empty className="border">
							<EmptyHeader>
								<EmptyMedia variant={"icon"}><InfoIcon /></EmptyMedia>
								<EmptyTitle>No books here</EmptyTitle>
								<EmptyDescription>{formatEmptyDescriptionByTab()}</EmptyDescription>
							</EmptyHeader>
						</Empty>
					</div>
				) : (
					<div className="large-container pb-6 grid 2xl:grid-cols-5 md:grid-cols-4 md:gap-2 gap-4 md:mt-2 mt-6">
						{books.map((book, index) => <BookCard key={index} book={book} />)}
					</div>
				)}
			</InfiniteScroll>
		</>
	)
}