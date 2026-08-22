import { BookCard } from "@/components/partials/BookCard"
import BooksSkeletons from "@/components/partials/BookSkeletons"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { AuthProps } from "@/interfaces/auth"
import { Book } from "@/interfaces/book"
import { Category } from "@/interfaces/category"
import { cn } from "@/lib/utils"
import { Deferred, Link, usePage } from "@inertiajs/react"
import { ArrowRight, InfoIcon, XCircleIcon, XIcon } from "lucide-react"
import { useEffect, useRef } from "react"

interface LandingPageProps {
	categories: Category[]
	books: Book[]
	auth: AuthProps
}

export default function LandingPage(props: LandingPageProps) {
	const auth = props.auth
	const { url } = usePage()
	const searchParams = new URLSearchParams(url.split("?")[1])
	const activeTab = searchParams.get('tab')
	const categoryRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

	useEffect(() => {
		// 2. Fetch the specific active DOM node from the map
		const activeNode = activeTab ? categoryRefs.current.get(activeTab) : null

		if (activeNode) {
			activeNode.scrollIntoView({
				behavior: "smooth",
				inline: "center", // Recommended for horizontal containers so it centers nicely
				block: "nearest"
			})
		}
	}, [activeTab])

	return (
		<>
			<div className={cn("flex-col flex-center", auth.user === null ? "h-[60vh] min-h-[400px]" : "h-[30vh]")}>
				<div className="max-w-xl w-full text-center">
					<h1 className="md:text-5xl text-4xl md:mb-4 mb-2">
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
			</div>
			<div className="large-container mb-2">
				<div className="flex gap-1 min-w-0 overflow-x-auto no-scrollbar">
					{props.categories.map(cat => {
						const isActive = activeTab === cat.slug

						return (
							<Button
								ref={(el) => {
									if (el) {
										categoryRefs.current.set(cat.slug, el)
									} else {
										categoryRefs.current.delete(cat.slug)
									}
								}}
								variant={isActive ? "outline" : "secondary"}
								className={cn("text-[15px] rounded-full", isActive ? "!border-foreground border-2 pr-1.5" : "")}
								key={cat.slug}
								nativeButton={false}
								render={<Link href={isActive ? "/books" : `/books?tab=${cat.slug}`} preserveState={true} />}
							>
								<span>{cat.name}</span>
								{isActive && (
									<div className="flex-center size-5 bg-foreground rounded-full">
										<XIcon stroke="var(--background)" className="size-3" />
									</div>
								)}
							</Button>
						)
					})}
				</div>
			</div>
			{props.books?.length == 0 && (

				<Empty className="border">
					<EmptyHeader>
						<EmptyMedia variant={"icon"}><InfoIcon /></EmptyMedia>
						<EmptyTitle>No books here</EmptyTitle>
						<EmptyDescription>Looks like there aren't any published books under this genre.</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
			{props.books?.length > 0 && (
				<div className="large-container pb-8 grid 2xl:grid-cols-5 md:grid-cols-4 gap-2 md:mt-0 mt-6">
					{props.books?.map((book, index) => (
						<div key={index}><BookCard book={book} /></div>
					))}
				</div>
			)}
			{/* <Deferred data={"books"} fallback={<BooksSkeletons />}> */}
			{/* </Deferred> */}
		</>
	)
}

