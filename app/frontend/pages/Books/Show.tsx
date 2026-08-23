import { BookCard } from "@/components/partials/BookCard"
import BooksSkeletons from "@/components/partials/BookSkeletons"
import { LinkUnderline } from "@/components/partials/LinkUnderline"
import { RatingStars } from "@/components/partials/RatingStars"
import ShareDialog from "@/components/partials/ShareDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { AuthProps } from "@/interfaces/auth"
import { Book } from "@/interfaces/book"
import { createBreadcrumbs, SimpleFormat, useIsMobile } from "@/lib/utils"
import { Deferred, Head, Link, useHttp } from "@inertiajs/react"
import { ArrowUpRightIcon, HeartIcon, ShareIcon } from "lucide-react"
import React, { useState } from "react"

interface BookPageProps {
	auth: AuthProps
	book: {
		slug: string
		title: string
		cover_url: string
		permalink: string
		description: string
		wiki_url: string
		is_saved: boolean
		average_rating: number
		ratings_count: number
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

export default function BookPage({ auth, book, category, authors, tags, similar_books }: BookPageProps) {
	const isMobile = useIsMobile()
	const [isShareOpen, setIsShareOpen] = useState<boolean>(false)
	const [isSaved, setIsSaved] = useState<boolean>(book.is_saved)
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: category.name, path: category.permalink },
		{ label: book.title, path: "" },
	]

	const saveHttp = useHttp({ slug: book.slug })

	const handleSaveBtn = () => {
		saveHttp.post('/books/save', {
			onSuccess: (res: any) => {
				if (res.success) {
					toast.add({ description: isSaved ? "Removed from collection" : "Saved to collection" })
					setIsSaved(!isSaved)
				}
			}
		}).catch(err => toast.add({ description: "Something went wrong try again" }))
	}

	return (
		<>
			<Head>
				<title>{book.title + " by " + authors.map(author => author.name).join(', ')}</title>
			</Head>
			<div className="lg:pt-0 pt-2">
				<div className="large-container mt-2 mb-4 md:block hidden">
					{createBreadcrumbs(crumbs)}
				</div>
				<div className="lg:grid grid-cols-12 large-container">
					<div className="lg:h-[calc(100vh_-_120px)] lg:max-h-[960px] col-span-7 w-full lg:sticky top-20 pb-5 flex flex-col gap-2 lg:pr-12 h-110">
						<div className="bg-card w-full h-full flex-center rounded-xl py-16 overflow-hidden">
							<div className="relative h-full aspect-[4/6]">
								<img className="h-full w-full relative z-1 rounded-[2px]" src={book.cover_url} alt={`${book.title}'s cover`} style={{ boxShadow: "-24px 24px 48px rgba(1,1,1,.5)" }} />
							</div>
						</div>
					</div>
					<div className="pt-6 col-span-5 flex flex-col gap-12 pb-5">
						<section>
							<h1 className="md:text-4xl text-2xl font-medium">{book.title}</h1>
							<h2 className="md:text-lg mt-0.5">
								{authors.map((author, index) => (
									<span key={index}>
										<span className="font-normal"><a href={author.permalink} className="text-subtle hover:text-foreground hover:underline transition">{author.name}</a></span>
										{index < authors.length - 1 && <span className="text-subtle">, </span>}
									</span>
								))}
							</h2>
							<div className="flex gap-1 mt-1">
								<div className="-ml-2">
									<Button variant={"ghost"} className={"px-2 text-[15px]"}>
										<RatingStars rating={book.average_rating} />
										<span>{book.average_rating} <span className="text-subtle">({book.ratings_count})</span></span>
									</Button>
								</div>
								{!auth.user && (
									<Button variant={"ghost"} className={"px-2 text-[15px]"} render={<Link href={"/login"} />}>
										<HeartIcon />
										Save
									</Button>
								)}
								{auth.user && (
									<Button variant={"ghost"} className={"px-2 text-[15px]"} onClick={handleSaveBtn} disabled={saveHttp.processing}>
										{saveHttp.processing && <Spinner />}
										{!saveHttp.processing && (
											<span>
												{isSaved ? <HeartIcon fill={"red"} stroke="none" /> : <HeartIcon />}
											</span>
										)}
										<span>{isSaved ? "Saved" : "Save"}</span>
									</Button>
								)}
								<Button
									variant={"ghost"}
									className={"px-2 text-[15px]"}
									onClick={() => setIsShareOpen(true)}
								>
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
							<div className="mt-8 md:block hidden">
								<Button size={"lg"} variant={"default"} className={"w-full h-10"}>Read</Button>
							</div>
						</section>
						<section>
							<h3 className="text-subtle mb-2 !font-normal">Book details</h3>
							<div className="flex flex-col gap-2 text-[15px]">
								<div className="grid grid-cols-[170px_1fr]">
									<h3 className="!font-normal">Original title</h3>
									<h3 className="!font-normal">Le mythe de Sisyphe</h3>
								</div>
								<div className="grid grid-cols-[170px_1fr]">
									<h3 className="text-subtle !font-normal">Translator</h3>
									<h3 className="!font-normal">Justin O'Brien</h3>
								</div>
								<div className="grid grid-cols-[170px_1fr]">
									<h3 className="text-subtle !font-normal">Language</h3>
									<h3 className="!font-normal">French</h3>
								</div>
								<div className="grid grid-cols-[170px_1fr]">
									<h3 className="text-subtle !font-normal">Publication date</h3>
									<h3 className="!font-normal">21 February 1848</h3>
								</div>
							</div>
						</section>
						<section>
							<h3 className="text-subtle mb-2 !font-normal">About the {authors.length > 1 ? "authors" : "author"}</h3>
							{authors.map((author, index) => (
								<div key={index}>
									<Link href={author.permalink} className="flex items-center gap-3 mb-3 group w-fit">
										<Avatar>
											<AvatarImage src={author.avatar_url} alt={author.name}></AvatarImage>
											<AvatarFallback>{author.name[0]}</AvatarFallback>
										</Avatar>
										<h3 className="text-[15px] group-hover:text-foreground/80 transition">{author.name}</h3>
									</Link>
									<div className="text-[15px] text-neutral-700 dark:text-neutral-300 line-clamp-3">{author.bio}</div>
								</div>
							))}
						</section>
					</div>
				</div>
				<div className="large-container mt-6">
					<h3 className="text-xl mb-4">Similar to this book</h3>
					<Deferred data={"similar_books"} fallback={<BooksSkeletons className="px-0 grid-cols-4" />}>
						<div className="grid md:grid-cols-4 gap-2">
							{similar_books?.map((book, index) => <BookCard key={index} book={book} />)}
						</div>
					</Deferred>
				</div>
				<div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden z-2">
					<Button className={"rounded-full h-11 px-6 shadow-lg"} size={"lg"}>Read the book <ArrowUpRightIcon /></Button>
				</div>
			</div>
			<ShareDialog url={`https://tomes.club${book.permalink}`} isOpen={isShareOpen} setIsOpen={setIsShareOpen} />
			<div className="pt-20"></div>
			<hr />
		</>
	)
}