import { BookCard } from "@/components/partials/BookCard";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Book } from "@/interfaces/book";
import { Head, Link, usePage } from "@inertiajs/react";
import { InfoIcon } from "lucide-react";

interface LibraryPageProps {
	currentTab: "reading" | "following" | "saved"
	books: Book[]
}

export default function LibraryPage({ currentTab, books }: LibraryPageProps) {
	const { url } = usePage()

	const searchParams = new URLSearchParams(url.split("?")[1])
	const activeTab = searchParams.get("tab") || "reading"

	const tabs = [
		{ label: "Reading", value: "reading", path: "/library?tab=reading" },
		{ label: "Following", value: "following", path: "/library?tab=following" },
		{ label: "Saved", value: "saved", path: "/library?tab=saved" },
	]

	const formatEmptyDescriptionByTab = () => {
		if (activeTab === "reading") return "You aren't reading any books currently. Books you start reading will appear here."
		if (activeTab === "following") return "You aren't following any authors with published books yet."
		if (activeTab === "saved") return "You haven't saved a book yet."
	}

	return (
		<>
			<Head>
				<title>Library</title>
			</Head>
			<div className="large-container flex-center flex-col h-[30vh] min-h-50">
				<h1 className="text-5xl mb-4">Library</h1>
				<p className="text-subtle">Your collection of books</p>
			</div>
			<div className="large-container">
				<div className="flex gap-2">
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
			{books?.length === 0 && (
				<div className="large-container mt-4">
					<Empty className="border">
						<EmptyHeader>
							<EmptyMedia variant={"icon"}><InfoIcon /></EmptyMedia>
							<EmptyTitle>No books here</EmptyTitle>
							<EmptyDescription>{formatEmptyDescriptionByTab()}</EmptyDescription>
						</EmptyHeader>
					</Empty>
				</div>
			)}
			{books?.length > 0 && (
				<div className="large-container pb-6 mt-2 grid md:grid-cols-4 md:gap-2 gap-4">
					{books.map((book, index) => <BookCard key={index} book={book} />)}
				</div>
			)}
		</>
	)
}