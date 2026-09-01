import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { BookPageProps } from "../Show";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { RatingStarsSlider } from "@/components/partials/RatingStars";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

interface Props {
	isOpen: boolean
	setIsOpen: (state: boolean) => void,
	book: BookPageProps['book']
}

export default function NewReviewDialog({ isOpen, setIsOpen, book }: Props) {
	const { data, setData, post, processing, resetAndClearErrors } = useForm({
		book_slug: "",
		rating: {
			score: 0,
			body: ""
		}
	})

	const handleSubmit = () => {
		if (processing || data.rating.score === 0) return
		setData('book_slug', book.slug)

		post('/ratings', {
			preserveState: true,
			onSuccess: (res) => {
				setIsOpen(false)
				resetAndClearErrors()
			},
			onError: (res) => toast.add({ description: "Something went wrong. Try again soon." })
		})
	}

	return (
		<Dialog open={isOpen} onOpenChange={open => {
			!open && setIsOpen(false)
			resetAndClearErrors()
		}}>
			<DialogContent className={"!max-w-[32rem] w-full max-h-[80vh] flex flex-col pt-12"}>
				<div className="flex flex-col items-center gap-6">
					<div className="w-25 aspect-book shadow-xl rounded-sm bg-card" style={{ background: `url(${book.cover_url}) center / cover` }}></div>
					<div className="flex-center flex-col gap-2">
						<h1 className="text-2xl">How would you rate this book?</h1>
						<RatingStarsSlider onChange={(score) => setData("rating.score", score)} size={24} />
					</div>
				</div>
				<div className="flex flex-col gap-5 mt-4">
					<Field>
						<Textarea
							onChange={(e) => setData("rating.body", e.target.value)}
							placeholder="Describe the reading experience (optional)"
							className="!text-[15px] bg-card border-none p-3 min-h-30 max-h-35 scrollbar-thumb-foreground/25" />
					</Field>
					<div className="mx-auto">
						<Button
							onClick={handleSubmit}
							size={"lg"}
							className={"rounded-full px-4"}
							variant={processing || data.rating.score === 0 ? "secondary" : "default"}
							disabled={processing || data.rating.score === 0}
						>
							{processing && <Spinner />}
							Add review
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}