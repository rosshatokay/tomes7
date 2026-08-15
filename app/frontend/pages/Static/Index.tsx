import { BookCard } from "@/components/partials/BookCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Book } from "@/interfaces/book"
import { Category } from "@/interfaces/category"
import { Deferred } from "@inertiajs/react"
import { ArrowRight } from "lucide-react"

interface LandingPageProps {
	categories: Category[]
	books: Book[]
}

export default function LandingPage(props: LandingPageProps) {
	return (
		<>
			<div className="h-[60vh] flex-col flex-center">
				<div className="max-w-xl w-full text-center">
					<h1 className="text-5xl font-medium mb-4">Read the greatest books <br /> of all time. For free.</h1>
					<p className="text-subtle">Access timeless classics for free.</p>
					<div className="mt-6">
						<Button size={"lg"} className={"text-base rounded-full"}>Join for free <ArrowRight /></Button>
					</div>
				</div>
			</div>
			<div className="large-container mb-4">
				<div className="flex gap-1">
					{props.categories.map(cat => (
						<Button variant={"secondary"} className={"text-[15px] rounded-full"} key={cat.slug}>{cat.name}</Button>
					))}
				</div>
			</div>
			<Deferred data={"books"} fallback={LoadingBooksSkeleton}>
				<div className="px-2 pb-2 grid grid-cols-4 gap-2">
					{props.books?.map((book, index) => (
						<div key={index}><BookCard book={book} /></div>
					))}
				</div>
			</Deferred>
		</>
	)
}

function LoadingBooksSkeleton() {
	return (
		<div className="grid grid-cols-4 gap-2 p-2">
			{Array.from({ length: 6 }).map((_, i) => (
				<Skeleton key={i} className="w-full rounded-xl aspect-square" />
			))}
		</div>
	)
}