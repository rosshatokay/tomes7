import { BookCard } from "@/components/partials/cards/BookCard"
import BooksSkeletons from "@/components/partials/BookSkeletons"
import { LinkUnderline } from "@/components/partials/LinkUnderline"
import BackBtnHeader from "@/components/partials/nav/BackBtnHeader"
import RatingsSheet from "@/components/partials/RatingsSheet"
import { RatingStars } from "@/components/partials/RatingStars"
import ShareDialog from "@/components/partials/ShareDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { AuthProps } from "@/interfaces/auth"
import { Book } from "@/interfaces/book"
import Rating from "@/interfaces/ratings"
import BaseLayout from "@/layouts/BaseLayout"
import { cn, SimpleFormat, useIsMobile } from "@/lib/utils"
import { Deferred, Link, useHttp } from "@inertiajs/react"
import { ArrowUpRightIcon, HeartIcon, InfoIcon, MoreHorizontalIcon, ShareIcon } from "lucide-react"
import { Fragment, useState } from "react"
import strftime from "strftime"
import ReadersSection, { ReadersSectionSkeleton } from "./partials/ReadersSection"
import NewReviewDialog from "./partials/NewReviewDialog"
import MoreOptionsMobileSheet from "./partials/MoreOptionsMobileSheet"
import Author from "@/interfaces/author"
import MainBreadcrumbs from "@/components/partials/MainBreadcrumbs"

export interface BookReaders {
	total_count: number
	preview_list: [
		{ username: string, avatar_url: string }
	]
}

export interface BookPageProps {
	auth: AuthProps
	book: {
		id: string
		slug: string
		title: string
		cover_url: string
		read_path: string
		share_url: string
		description: string
		wiki_url: string
		is_saved: boolean
		average_rating: number
		ratings_count: number
		details: Record<string, string>
	}
	tags: [{ name: string }]
	genre: {
		name: string
		permalink: string
	}
	authors: Author[]
	similar_books: Book[]
	ratings_snippet: Rating[]
	readers: BookReaders
	progress?: number
}

export default function BookPage({
	auth,
	book,
	genre,
	authors,
	tags,
	similar_books,
	ratings_snippet,
	readers,
	progress
}: BookPageProps) {
	const isMobile = useIsMobile()
	const [isRatingsSheetOpen, setIsRatingsSheetOpen] = useState(false)
	const [isShareOpen, setIsShareOpen] = useState<boolean>(false)
	const [isSaved, setIsSaved] = useState<boolean>(book.is_saved)
	const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
	const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false)

	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: genre.name, path: genre.permalink },
		{ label: book.title, path: "" },
	]
	const bookDetailsKeys = Object.keys(book.details)

	const saveHttp = useHttp({ slug: book.slug })
	const handleSaveBtn = () => {
		saveHttp.post('/books/save', {
			onSuccess: (res: any) => {
				if (res.success) {
					toast.add({ description: isSaved ? "Removed from collection" : "Saved to collection" })
					setIsSaved(!isSaved)
				}
			}
		}).catch(_ => toast.add({ description: "Something went wrong try again" }))
	}

	console.log(book.read_path)
	
	return (
		<>
			<BackBtnHeader>
				<Button size={"icon-lg"} variant={"ghost"} onClick={() => setIsShareOpen(true)}><ShareIcon /></Button>
				<Button size={"icon-lg"} variant={"ghost"} onClick={() => setIsMoreOptionsOpen(true)}><MoreHorizontalIcon /></Button>
			</BackBtnHeader>
			<div className="lg:pt-0 pt-2">
				<MainBreadcrumbs breadcrumbs={crumbs} className="md:block hidden" />
				<div className="lg:grid grid-cols-12 large-container">
					<div className="lg:h-[calc(100vh_-_120px)] lg:max-h-[960px] col-span-8 w-full lg:sticky top-20 md:pb-5 flex flex-col gap-2 lg:pr-8 h-110">
						<div className="bg-card w-full h-full flex-center rounded-xl py-16 overflow-hidden">
							<div className="relative h-full aspect-[4/6]">
								<img className="h-full w-full relative z-1 rounded-sm" src={book.cover_url} alt={`${book.title}'s cover`} style={{ boxShadow: "-24px 24px 48px rgba(1,1,1,.5)" }} />
							</div>
						</div>
					</div>
					<div className="pt-6 col-span-4 flex flex-col gap-12 pb-5">
						<section>
							<h1 className="md:text-[40px] md:leading-none text-3xl font-headline leading-[1.2]">{book.title}</h1>
							<h2 className="md:text-lg mt-2">
								{authors.map((author, index) => (
									<span key={index}>
										<span className="font-normal"><Link href={author.permalink} className="text-subtle hover:text-foreground hover:underline transition">{author.full_name}</Link></span>
										{index < authors.length - 1 && <span className="text-subtle">, </span>}
									</span>
								))}
							</h2>
							<div className="flex gap-1 mt-1">
								<div className="-ml-2">
									<Button variant={"ghost"} className={"px-2 text-[15px]"} onClick={() => setIsRatingsSheetOpen(true)}>
										<RatingStars rating={book.average_rating} />
										<span className="text-subtle">({book.ratings_count})</span>
									</Button>
								</div>
								{!auth.user && (
									<Button variant={"ghost"} className={"px-2 text-[15px]"} onClick={() => toast.add({description: "Account required to complete this action"})}>
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
								<div className="text-neutral-700 dark:text-neutral-300 line-clamp-3">{SimpleFormat(book.description)}</div>
								{book.wiki_url && <p className="text-sm mt-2 text-subtle">Read more at <LinkUnderline href={book.wiki_url} className="text-foreground" target="_blank">Wikipedia</LinkUnderline>.</p>}
							</div>
							{tags?.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-6">
									{tags.map(tag => (
										<Badge key={tag.name} variant={"secondary"} className="h-7 px-3 text-sm font-normal text-foreground/75 capitalize">{tag.name}</Badge>
									))}
								</div>
							)}
							<div className="mt-8 md:block hidden">
								<Button size={"lg"} variant={"default"} className={"w-full h-10 mb-2"} nativeButton={false} render={<Link href={book.read_path} />}>
									{progress ? (
										<Fragment>Continue reading • {Math.round(progress * 100)}%</Fragment>
									) : (
										<Fragment>Read now</Fragment>
									)}
								</Button>
								{auth.user ? (
									<Button size={"lg"} variant={"secondary"} className={"w-full h-10"} onClick={() => setIsReviewDialogOpen(true)}>Write a review</Button>
								) : (
									<Button size={"lg"} variant={"secondary"} className={"w-full h-10"} onClick={() => toast.add({description: "Account required to complete this action"})}>Write a review</Button>
								)}
								<Deferred data="readers" fallback={<ReadersSectionSkeleton />}>
									{readers && (
										<ReadersSection readers={readers} />
									)}
								</Deferred>
							</div>
						</section>
						{bookDetailsKeys?.length > 0 && (
							<section>
								<h3 className="text-base mb-2">Original edition details</h3>
								<div className="flex flex-col gap-2 text-base">
									{bookDetailsKeys.map((bk, i) => (
										<div key={i} className="grid md:grid-cols-[170px_1fr] grid-cols-[140px_1fr] gap-2">
											<h3 className={cn("!font-normal", i > 0 && "text-subtle")}>{bk}</h3>
											<h3 className="!font-normal">{book.details[bk]}</h3>
										</div>
									))}
								</div>
							</section>
						)}
						<section>
							<h3 className="text-base mb-2">About the {authors.length > 1 ? "authors" : "author"}</h3>
							{authors.map((author, index) => (
								<div key={index}>
									<Link href={author.permalink} className="flex items-center gap-3 mb-3 group w-fit">
										<Avatar>
											<AvatarImage src={author.avatar_url} alt={author.full_name}></AvatarImage>
											<AvatarFallback>{author.full_name[0]}</AvatarFallback>
										</Avatar>
										<h3 className="text-base group-hover:text-foreground/80 transition">{author.full_name}</h3>
									</Link>
									<div className="text-base text-neutral-700 dark:text-neutral-300 line-clamp-3">{author.bio}</div>
								</div>
							))}
						</section>
						<section>
							<div className="flex items-center gap-2 mb-2">
								<h3 className="text-base">Reviews</h3>
							</div>
							{ratings_snippet?.length > 0 ? (
								<Fragment>

									<div className="flex flex-col gap-4">
										{ratings_snippet?.map((rating, index) => (
											<div key={index}>
												<div className="flex items-center gap-3 mb-2">
													<Avatar>
														<AvatarImage src={rating.user.avatar_url} />
														<AvatarFallback>{rating.user.username[0]}</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-normal">{rating.user.username}</div>
														<div className="flex items-center gap-2">
															<RatingStars rating={rating.score} />
															<div className="text-sm text-subtle">{strftime('%b %d, %Y', new Date(rating.created_at))}</div>
														</div>
													</div>
												</div>
												<p className="line-clamp-3">{rating.body}</p>
											</div>
										))}
									</div>
									<div className="mt-4">
										<Button className={"w-full"} variant={"secondary"} size={"lg"} onClick={() => setIsRatingsSheetOpen(true)}>See all reviews</Button>
									</div>
								</Fragment>
							) : (
								<Empty className="border">
									<EmptyHeader>
										<EmptyMedia variant={"icon"}><InfoIcon /></EmptyMedia>
										<EmptyTitle>No reviews yet</EmptyTitle>
										<EmptyDescription>This book doesn't have any reviews yet. Be the first!</EmptyDescription>
									</EmptyHeader>
									<EmptyContent>
										{auth.user ? (
											<Button onClick={() => setIsReviewDialogOpen(true)}>Add review</Button>
										) : (
											<Button nativeButton={true} onClick={() => toast.add({description: "Account required to complete this action"})}>Add review</Button>
										)}
									</EmptyContent>
								</Empty>
							)}
						</section>
					</div>
				</div>
				<div className="large-container mt-6">
					<h3 className="text-xl mb-4">Similar to this book</h3>
					<Deferred data={"similar_books"} fallback={<BooksSkeletons className="px-0 md:grid-cols-4 grid-cols-1" />}>
						<div className="grid md:grid-cols-4 grid-cols-1 gap-2">
							{similar_books?.map((book, index) => <BookCard key={index} book={book} />)}
						</div>
					</Deferred>
				</div>
				<div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden z-2">
					<Button
						className={"rounded-full h-11 px-6 shadow-lg"}
						size={"lg"}
						render={<Link href={book.read_path} />}
						nativeButton={false}
					>
						Read the book <ArrowUpRightIcon />
					</Button>
				</div>
			</div>
			<ShareDialog url={book.share_url} title="Share book" isOpen={isShareOpen} setIsOpen={setIsShareOpen} />
			<div className="pt-20"></div>
			<hr />
			<RatingsSheet bookSlug={book.slug} isOpen={isRatingsSheetOpen} setIsOpen={setIsRatingsSheetOpen} />
			<NewReviewDialog isOpen={isReviewDialogOpen} setIsOpen={setIsReviewDialogOpen} book={book} />
			{isMobile && <MoreOptionsMobileSheet
				isOpen={isMoreOptionsOpen}
				setIsOpen={setIsMoreOptionsOpen}
				author={authors[0]}
				book={book}
				isSaved={isSaved}
				isSaveProcessing={saveHttp.processing}
				handleSavedBtn={handleSaveBtn}
				setIsReviewDialogOpen={setIsReviewDialogOpen}
			/>}
		</>
	)
}

BookPage.layout = (page: React.ReactNode) => <BaseLayout hideHeader={true} hideMobileNav={true}>{page}</BaseLayout>