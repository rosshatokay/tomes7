import { BookCard } from "@/components/partials/cards/BookCard"
import MainBreadcrumbs from "@/components/partials/MainBreadcrumbs"
import MainHeader from "@/components/partials/MainHeader"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { AuthProps } from "@/interfaces/auth"
import { Book } from "@/interfaces/book"
import { Genre } from "@/interfaces/genre"
import { InfiniteScroll, Link, router } from "@inertiajs/react"
import { InfoIcon } from "lucide-react"
import SortSelect from "../../components/partials/SortSelect"

interface GenrePageProps {
	genre: Genre
	auth: AuthProps
	books: Book[]
	current_sort: string
}

export default function GenrePage({ auth, genre, books, current_sort }: GenrePageProps) {
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: "Explore", path: "/explore" },
		{ label: genre.name, path: `/genres/${genre.slug}` },
	]

	const sortItems = [
		{ label: "Most recent", value: "most-recent" },
		{ label: "Top rated", value: "top-rated" }
	]

	return (
		<>
			<MainBreadcrumbs breadcrumbs={crumbs} />
			<MainHeader title={genre.name} badge="Genres" />
			<div className="large-container pb-12">
				{books.length > 0 && (
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2">
							<div className="text-sm text-subtle">Sort by</div>
							<SortSelect endpoint={`/genres/${genre.slug}`} currentSort={current_sort} sortItems={sortItems} />
						</div>
						<div className="text-sm text-subtle">Showing {books.length} {books.length === 1 ? "book" : "books"}</div>
					</div>
				)}
				<InfiniteScroll data="books" loading={<div className="flex-center pt-10"><Spinner className="size-6" /></div>}>
					{books.length > 0 ? (
						<div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2">
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

