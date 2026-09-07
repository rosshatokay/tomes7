import AuthorCard from "@/components/partials/cards/AuthorCard";
import { BookCard } from "@/components/partials/cards/BookCard";
import MainBreadcrumbs from "@/components/partials/MainBreadcrumbs";
import MainHeader from "@/components/partials/MainHeader";
import { AuthProps } from "@/interfaces/auth";
import Author from "@/interfaces/author";
import { Book } from "@/interfaces/book";
import { Category } from "@/interfaces/category";
import { getCategoryIcon } from "@/lib/utils";
import { Link } from "@inertiajs/react";

interface Props {
	categories: Category[]
	authors: Author[]
	recent_books: Book[]
	auth: AuthProps
}

export default function ExplorePage({ categories, authors, recent_books, auth }: Props) {
	const sections = [
		{
			heading: "By category",
			items: categories.map(category => (
				<div className="bg-card flex flex-col rounded-xl gap-12 p-5" key={category.slug}>
					{/* <Link href={category.} /> */}
					{getCategoryIcon(category.slug)}
					<h3 className="mt-auto">{category.name}</h3>
				</div>
			))
		},
		{
			heading: "By author",
			seeAllPath: "/authors",
			items: authors.map(author => <AuthorCard author={author} auth={auth} key={author.permalink} />)
		},
		{
			heading: "Recently added",
			seeAllPath: "/authors",
			items: recent_books.map(book => <BookCard book={book} key={book.permalink} />)
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
							<div className="flex items-center justify-between">
								<h2 className="text-xl mb-4">{sec.heading}</h2>
								{sec.seeAllPath && (<Link href={sec.seeAllPath} className="text-subtle hover:text-foreground transition">See all</Link>)}
							</div>
							<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2">
								{sec.items}
							</div>
						</section>
					))}
				</div>
			</div>
		</>
	)
}