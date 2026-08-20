import { BookCard } from "@/components/partials/BookCard"
import BooksSkeletons from "@/components/partials/BookSkeletons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { AuthProps } from "@/interfaces/auth"
import { Book } from "@/interfaces/book"
import { Category } from "@/interfaces/category"
import { cn } from "@/lib/utils"
import { Deferred } from "@inertiajs/react"
import { ArrowRight } from "lucide-react"

interface LandingPageProps {
	categories: Category[]
	books: Book[]
	auth: AuthProps
}

export default function LandingPage(props: LandingPageProps) {
	const auth = props.auth

	return (
		<>
			<div className={cn("flex-col flex-center", auth.user === null ? "h-[60vh] min-h-[400px]" : "h-[30vh]")}>
				<div className="max-w-xl w-full text-center">
					<h1 className="text-5xl font-medium mb-4">
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
				<div className="flex gap-1">
					{props.categories.map(cat => (
						<Button variant={"secondary"} className={"text-[15px] rounded-full"} key={cat.slug}>{cat.name}</Button>
					))}
				</div>
			</div>
			<div className="large-container pb-8 grid grid-cols-4 gap-2">
				{props.books?.map((book, index) => (
					<div key={index}><BookCard book={book} /></div>
				))}
			</div>
			{/* <Deferred data={"books"} fallback={<BooksSkeletons />}> */}
			{/* </Deferred> */}
		</>
	)
}

