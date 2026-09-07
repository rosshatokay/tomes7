import { BookCard } from "@/components/partials/cards/BookCard"
import BooksSkeletons from "@/components/partials/BookSkeletons"
import MainHeader from "@/components/partials/MainHeader"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { AuthProps } from "@/interfaces/auth"
import { Book } from "@/interfaces/book"
import { Category } from "@/interfaces/category"
import { cn } from "@/lib/utils"
import { Deferred, Head, Link, usePage } from "@inertiajs/react"
import { ArrowRight, InfoIcon, XCircleIcon, XIcon } from "lucide-react"
import { Fragment, useEffect, useRef } from "react"

interface CategoryPageProps {
	books: Book[]
	auth: AuthProps
}

// const sortByItems = [
// 	{ label: "Top rated", value: "top-rated" },
// 	{ label: "Most recent", value: "most-recent" },
// ]

export default function CategoryPage({ auth, books }: CategoryPageProps) {
	const pageTitle = () => {
		return !auth.user ? (
			<span className="text-center block max-w-xl">Read the greatest books of all time. For free.</span>
		) : (<span>Books</span>)
	}

	return (
		<>
			<MainHeader
				title={pageTitle()}
				description={auth.user ? "Access timeless classics" : "Access timeless classics for free"}
				content={!auth.user && <div className="mt-6">
					<Button size={"lg"} className={"text-base rounded-full"}>Join for free <ArrowRight /></Button>
				</div>}
				className={auth.user === null ? "h-[50vh] min-h-[400px]" : "h-[30vh]"}
			/>
			{/* <div className={cn("flex-col flex-center", auth.user === null ? "h-[60vh] min-h-[400px]" : "h-[30vh]")}>
				<div className="max-w-xl w-full text-center">
					<h1 className="md:text-5xl text-4xl md:mb-4 mb-2 font-headline">
						{auth.user === null ?
							(<span>Read the greatest books <br /> of all time. For free.</span>)
							: (<span>Books</span>)}
					</h1>
					{auth.user !== null && (
						<p className="text-subtle">Explore the timeless classics</p>
					)}
					{auth.user === null && (
						<div>
							<p className="text-subtle">Access timeless classics for free.</p>
							<div className="mt-6">
								<Button size={"lg"} className={"text-base rounded-full"}>Join for free <ArrowRight /></Button>
							</div>
						</div>
					)}
				</div>
			</div> */}
			{books?.length == 0 && (
				<div className="large-container">
					<Empty className="border">
						<EmptyHeader>
							<EmptyMedia variant={"icon"}><InfoIcon /></EmptyMedia>
							<EmptyTitle>No books here</EmptyTitle>
							<EmptyDescription>Looks like there aren't any published books under this genre.</EmptyDescription>
						</EmptyHeader>
					</Empty>
				</div>
			)}
			{books?.length > 0 && (
				<div className="large-container pb-8 grid 2xl:grid-cols-5 md:grid-cols-4 gap-2 md:mt-0 mt-6">
					{books?.map((book, index) => (
						<Fragment key={index}><BookCard book={book} /></Fragment>
					))}
				</div>
			)}
			{/* <Deferred data={"books"} fallback={<BooksSkeletons />}> */}
			{/* </Deferred> */}
		</>
	)
}

