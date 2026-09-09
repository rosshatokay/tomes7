import { BookCard } from "@/components/partials/cards/BookCard"
import MainBreadcrumbs from "@/components/partials/MainBreadcrumbs"
import MainHeader from "@/components/partials/MainHeader"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { AuthProps } from "@/interfaces/auth"
import { Book } from "@/interfaces/book"
import { Genre } from "@/interfaces/genre"
import { InfiniteScroll } from "@inertiajs/react"
import { InfoIcon } from "lucide-react"

interface GenrePageProps {
	genre: Genre
	auth: AuthProps
	books: Book[]
}

export default function GenrePage({ auth, genre, books }: GenrePageProps) {
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: "Explore", path: "/explore" },
		{ label: genre.name, path: `/genres/${genre.slug}` },
	]
	const sortItems = [
		{ label: "Most recent", value: "most-recent" },
		{ label: "Top rated", value: "top-rated" },
	]

	return (
		<>
			<MainBreadcrumbs breadcrumbs={crumbs} />
			<MainHeader title={genre.name} badge="Genres" />
			<div className="large-container pt-12">
				{/* <div className="mb-6">
					<h3 className="text-subtle mb-1">Genres</h3>
					<h1 className="font-headline text-4xl">{genre.name}</h1>
				</div> */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<div className="text-sm text-subtle">Sort by</div>
						<Select items={sortItems} defaultValue={"most-recent"}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{sortItems.map(item => (
										<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="text-sm text-subtle">Showing 0 books</div>
				</div>
				<InfiniteScroll data="books" loading={<div className="flex-center pt-10"><Spinner className="size-6" /></div>}>
					{books.length > 0 ? (
						<div className="grid grid-cols-4 gap-2">
							{books.map(book => (
								<BookCard book={book} key={book.slug} />
							))}
						</div>
					) : (
						<Empty className="border">
							<EmptyHeader>
								<EmptyMedia variant={"icon"}><InfoIcon /></EmptyMedia>
								<EmptyTitle>No books here</EmptyTitle>
								<EmptyDescription>Looks like there aren't any published books available in the {genre.name} genre. Check back again soon.</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
				</InfiniteScroll>
			</div>
		</>
	)
}

