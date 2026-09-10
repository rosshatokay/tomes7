import AuthorCard from "@/components/partials/cards/AuthorCard";
import { BookCard } from "@/components/partials/cards/BookCard";
import MainBreadcrumbs from "@/components/partials/MainBreadcrumbs";
import MainHeader from "@/components/partials/MainHeader";
import { AuthProps } from "@/interfaces/auth";
import Author from "@/interfaces/author";
import { Book } from "@/interfaces/book";
import { Genre } from "@/interfaces/genre";
import { getGenreIcon } from "@/lib/utils";
import { Link } from "@inertiajs/react";

interface Props {
	genres: Genre[]
	authors: Author[]
	recent_books: Book[]
	auth: AuthProps
}

export default function ExplorePage({ genres, authors, recent_books, auth }: Props) {
	const sections = [
		{
			heading: "By genre",
			items: (
				<div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2">
					{genres.map(genre => (
						<div className="relative bg-card hover:bg-black/10 dark:hover:bg-white/10 flex flex-col rounded-xl gap-12 p-5" key={genre.slug}>
							<Link href={genre.permalink} className="absolute inset-0" />
							{getGenreIcon(genre.slug)}
							<h3 className="mt-auto">{genre.name}</h3>
						</div>
					))}
				</div>
			)
		},
		{
			heading: "By author",
			seeAllPath: "/authors",
			items: (
				<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
					{authors.map(author => <AuthorCard author={author} auth={auth} key={author.permalink} />)}
				</div>
			)
		},
		{
			heading: "Recently added",
			items: (
				<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
					{recent_books.map(book => <BookCard book={book} key={book.permalink} />)}
				</div>
			)
		}
	]

	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: "Explore", path: "/explore" }
	]

	return (
		<>
			<MainBreadcrumbs breadcrumbs={crumbs} />
			<MainHeader title="Explore" description="Browse the Tomes library for books" />
			<div className="large-container">
				<div className="flex flex-col gap-16">
					{sections.map((sec, index) => (
						<section key={index}>
							<div className="flex items-center justify-between mb-4">
								<h2 className="md:text-xl text-lg">{sec.heading}</h2>
								{sec.seeAllPath && (<Link href={sec.seeAllPath} className="text-subtle hover:text-foreground transition">See all</Link>)}
							</div>
							{sec.items}
							{/* <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
							</div> */}
						</section>
					))}
				</div>
			</div>
		</>
	)
}