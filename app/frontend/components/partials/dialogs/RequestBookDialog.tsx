import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useHotkeys } from "react-hotkeys-hook";

export default function RequestBookDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (state: boolean) => void }) {
	const { data, setData, post, processing, errors, clearErrors, resetAndClearErrors } = useForm({
		feedback: {
			book_title: "",
			author_name: ""
		}
	})

	const handleSubmit = () => {
		post("/feedbacks/book-request", {
			onSuccess: () => {
				setIsOpen(false)
				resetAndClearErrors()
			}
		})
	}

	return (
		<Dialog open={isOpen} onOpenChange={(open: boolean) => !open && setIsOpen(false)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Request a book</DialogTitle>
					<DialogDescription>Let us know which public domain book you'd like to read on Tomes.</DialogDescription>
				</DialogHeader>
				<FieldGroup>
					<Field>
						<FieldLabel>Title</FieldLabel>
						<Input
							value={data.feedback.book_title}
							placeholder="Enter the book's title"
							onChange={e => {
								setData('feedback.book_title', e.target.value)
								clearErrors('feedback.book_title')
							}}
							aria-invalid={!!errors['feedback.book_title']}
						/>
						{errors['feedback.book_title'] && <FieldError>{errors['feedback.book_title']}</FieldError>}
					</Field>
					<Field>
						<FieldLabel>Author</FieldLabel>
						<Input
							value={data.feedback.author_name}
							placeholder="Enter the book author's name"
							onChange={e => {
								setData('feedback.author_name', e.target.value)
								clearErrors('feedback.author_name')
							}}
							aria-invalid={!!errors['feedback.author_name']}
						/>
						{errors['feedback.author_name'] && <FieldError>{errors['feedback.author_name']}</FieldError>}
					</Field>
				</FieldGroup>
				<DialogFooter>
					<Button onClick={handleSubmit} variant={processing ? "secondary" : "default"} disabled={processing}>
						{processing ? <Spinner /> : ""}
						Send
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}