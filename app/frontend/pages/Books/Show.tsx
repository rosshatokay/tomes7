import { BookCard } from "@/components/partials/BookCard"
import BooksSkeletons from "@/components/partials/BookSkeletons"
import { LinkUnderline } from "@/components/partials/LinkUnderline"
import { RatingStars } from "@/components/partials/RatingStars"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Book } from "@/interfaces/book"
import { createBreadcrumbs } from "@/lib/utils"
import { Deferred } from "@inertiajs/react"
import { GlassesIcon, HeartIcon, ShareIcon } from "lucide-react"
import React from "react"

interface BookPageProps {
	book: {
		title: string
		cover_url: string
		description: string
		wiki_url: string
	}
	tags: [{ name: string }]
	category: {
		name: string
		permalink: string
	}
	authors: [{
		name: string
		avatar_url: string
		bio: string
		permalink: string
	}]
	similar_books: Book[]
}

function SimpleFormat(text: string) {
	if (!text) return null;

	return text.split(/\n\n+/).map((paragraph: string, pIndex: number) => (
		<p key={pIndex}>
			{paragraph.split('\n').map((line, lIndex) => (
				<React.Fragment key={lIndex}>
					{line}
					{lIndex < paragraph.split('\n').length - 1 && <br />}
				</React.Fragment>
			))}
		</p>
	));
}


export default function BookPage({ book, category, authors, tags, similar_books }: BookPageProps) {
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: category.name, path: category.permalink },
		{ label: book.title, path: "" },
	]

	return (
		<div>
			<div className="large-container my-4">
				{createBreadcrumbs(crumbs)}
			</div>
			<div className="grid grid-cols-12 large-container">
				<div className="h-[calc(100vh_-_120px)] col-span-7 sticky top-20 pb-5 flex flex-col gap-2 pr-12">
					<div className="bg-card w-full h-full flex-center rounded-xl py-16 overflow-hidden">
						<div className="relative h-full aspect-[4/6]">
							<img className="h-full w-full relative z-1 rounded-[2px]" src={book.cover_url} style={{ boxShadow: "-24px 24px 48px rgba(1,1,1,.5)" }} />
						</div>
					</div>
				</div>
				<div className="pt-6 col-span-5 flex flex-col gap-12 pb-5">
					<section>
						<h1 className="text-4xl font-medium">{book.title}</h1>
						<h2 className="text-lg mt-0.5">
							{authors.map((author, index) => (
								<span key={index}>
									<span><a href={author.permalink} className="text-subtle hover:text-foreground hover:underline transition">{author.name}</a></span>
									{index < authors.length - 1 && <span className="text-subtle">, </span>}
								</span>
							))}
						</h2>
						<div className="flex gap-1 mt-1">
							<div className="-ml-2">
								<Button variant={"ghost"} className={"px-2 text-[15px]"}>
									<RatingStars rating={4} />
									<span>4.2 <span className="text-subtle">(24)</span></span>
								</Button>
							</div>
							<Button variant={"ghost"} className={"px-2 text-[15px]"}>
								<HeartIcon />
								<span>Save</span>
							</Button>
							<Button variant={"ghost"} className={"px-2 text-[15px]"}>
								<ShareIcon />
								<span>Share</span>
							</Button>
						</div>
						<div className="mt-4">
							<div className="text-[15px] text-neutral-700 dark:text-neutral-300 line-clamp-3">{SimpleFormat(book.description)}</div>
							{book.wiki_url && <p className="text-sm mt-2 text-subtle">Read more at <LinkUnderline href={book.wiki_url} className="text-foreground" target="_blank">Wikipedia</LinkUnderline>.</p>}
						</div>
						<div className="flex flex-wrap gap-2 mt-4">
							{tags.map(tag => (
								<Badge key={tag.name} variant={"outline"} className="h-7 px-3 text-sm font-normal text-subtle">{tag.name}</Badge>
							))}
						</div>
						<div className="mt-8">
							<Button size={"lg"} variant={"default"} className={"w-full h-10"}><GlassesIcon /> Read</Button>
						</div>
					</section>
					<section>
						<h3 className="text-subtle mb-2">Book details</h3>
						<div className="flex flex-col gap-2 text-[15px]">
							<div className="grid grid-cols-[170px_1fr]">
								<h3 className="">Original title</h3>
								<h3>Le mythe de Sisyphe</h3>
							</div>
							<div className="grid grid-cols-[170px_1fr]">
								<h3 className="text-subtle">Translator</h3>
								<h3>Justin O'Brien</h3>
							</div>
							<div className="grid grid-cols-[170px_1fr]">
								<h3 className="text-subtle">Language</h3>
								<h3>French</h3>
							</div>
							<div className="grid grid-cols-[170px_1fr]">
								<h3 className="text-subtle">Publication date</h3>
								<h3>21 February 1848</h3>
							</div>
						</div>
					</section>
					<section>
						<h3 className="text-subtle mb-2">About the {authors.length > 1 ? "authors" : "author"}</h3>
						{authors.map((author, index) => (
							<div key={index}>
								<div className="flex items-center gap-3 mb-3">
									<Avatar>
										<AvatarImage src={author.avatar_url} alt={author.name}></AvatarImage>
										<AvatarFallback>{author.name[0]}</AvatarFallback>
									</Avatar>
									<h3 className="text-[15px]">{author.name}</h3>
								</div>
								<div className="text-[15px] text-neutral-700 dark:text-neutral-300 line-clamp-3">{author.bio}</div>
							</div>
						))}
					</section>
				</div>
			</div>
			<div className="large-container mt-6 mb-4">
				<h3 className="text-xl">Similar to this book</h3>
			</div>
			<div className="px-2">
				<Deferred data={"similar_books"} fallback={<BooksSkeletons className="px-0 grid-cols-4" />}>
					<div className="grid grid-cols-4 gap-2">
						{similar_books?.map((book, index) => <BookCard key={index} book={book} />)}
					</div>
				</Deferred>
			</div>
		</div>
	)
}