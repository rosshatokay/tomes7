import { Fragment, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "../ui/sheet";
import { RatingStars } from "./RatingStars";
import { useHttp } from "@inertiajs/react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { InfoIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import Rating from "@/interfaces/ratings";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import strftime from "strftime";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SimpleFormat } from "@/lib/utils";

interface Meta {
	ratingsCount: number
	averageRating: number
	scoreFrequencies: Record<number, number>
	ratings: Rating[]
}

interface Props {
	bookSlug: string
	isOpen: boolean
	setIsOpen: (state: boolean) => void
}

const sortItems = [
	{ label: "Most recent", value: "most-recent" },
	{ label: "Oldest first", value: "oldest-first" },
	{ label: "Most votes", value: "most-votes" },
]

export default function RatingsSheet({
	bookSlug,
	isOpen,
	setIsOpen
}: Props) {
	const http = useHttp({ book_slug: "" })
	const [data, setData] = useState<Meta | null>(null)

	const handleSuccessfulResponse = (res: any) => {
		setData({
			ratingsCount: res.ratings_count,
			averageRating: res.average_rating,
			scoreFrequencies: res.score_frequencies,
			ratings: res.ratings
		})
	}

	useEffect(() => {
		if (!isOpen) return

		http.setData('book_slug', bookSlug)
		http.get('/api/v1/books/ratings', {
			onSuccess: handleSuccessfulResponse
		})
	}, [isOpen])

	return (
		<Sheet
			open={isOpen}
			onOpenChange={open => !open && setIsOpen(false)}
		>
			<SheetContent side="bottom" className={"max-h-[90vh] !h-full rounded-t-xl"}>
				<div className="max-w-2xl w-full mx-auto py-12">
					<h1 className="text-3xl mb-4">Reviews</h1>
					{http.processing && (
						<div className="flex-center w-full py-12"><Spinner className="size-6" /></div>
					)}
					{!http.wasSuccessful && !http.processing && (
						<Empty className="bg-card">
							<EmptyHeader>
								<EmptyMedia variant={"icon"}><InfoIcon /></EmptyMedia>
								<EmptyTitle>Something went wrong</EmptyTitle>
								<EmptyDescription>We couldn't get the ratings for this book. Try again soon.</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
					{http.wasSuccessful && !http.processing && (
						<Fragment>
							<div className="flex items-center gap-6">
								<div className="flex flex-col gap-1">
									<h2 className="text-3xl">{data?.averageRating || 0}</h2>
									<div>
										<RatingStars rating={data?.averageRating || 0} size={20} />
									</div>
									<p className="text-subtle">{data?.ratingsCount} {data?.ratingsCount === 1 ? 'rating' : 'ratings'}</p>
								</div>
								<div className="flex flex-col w-full">
									{Object.keys(data?.scoreFrequencies || {}).reverse().map((k) => {
										const percentage = Math.round((data?.scoreFrequencies[parseInt(k)] || 0 / (data?.ratingsCount || 1)) * 100)

										return (
											<div key={k} className="flex w-full py-px items-center gap-3">
												<div className="text-xs">{k}</div>
												<div className="bg-card w-full h-2 rounded-full overflow-hidden">
													<div className="h-full bg-foreground rounded-full" style={{ width: `${percentage}%` }}></div>
												</div>
											</div>
										)
									})}
								</div>
							</div>
							<Select items={sortItems}>
								<SelectTrigger className={"rounded-full my-6"}>
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{sortItems.map(item => (
											<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<div>
								{data?.ratings.map(rating => (
									<div key={rating.id} className="mb-6 border-b pb-6 flex flex-col gap-4">
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarImage src={rating.user.avatar_url} />
												<AvatarFallback>{rating.user.username[0]}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-normal text-base leading-none mb-1">{rating.user.username}</div>
												<div className="flex items-center gap-2">
													<RatingStars rating={rating.score} />
													<div className="text-sm text-subtle">{strftime('%b %d, %Y', new Date(rating.created_at))}</div>
												</div>
											</div>
										</div>
										<div>{SimpleFormat(rating.body)}</div>
									</div>
								))}
							</div>
						</Fragment>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}