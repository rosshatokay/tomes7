import { Combobox } from "@/components/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useForm, useHttp } from "@inertiajs/react"
import { Fragment, useEffect, useRef, useState } from "react"
import { AuthorsCombobox, BookTagsComboBox, CategoryComboBox } from "./Comboboxes"
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/spinner"
import { FileTextIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatBytes } from "@/lib/utils"

const INITIAL_BOOK_STATE = {
	id: null as string | null,
	title: "",
	category: {
		name: "",
		id: null
	},
	authors: [],
	description: "",
	cover: null as File | string | null,
	wiki_url: "",
	epub: null as File | null | {
		filename: string
		byte_size: number
	}
}

interface Props {
	activeBookId: string | "new" | null
	setActiveBookId: (id: string | "new" | null) => void
}

type attachedEpub = {
	filename: string
	byte_size: number
}

export default function BookSheet({ activeBookId, setActiveBookId }: Props) {
	const http = useHttp({ id: "" })
	const isEditing = activeBookId !== null && activeBookId !== "new"
	const isOpen = activeBookId !== null
	const [attachedEpubDetails, setAttachedEpubDetails] = useState<attachedEpub | null>(null)
	const imageFileInputRef = useRef<HTMLInputElement>(null)
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

	const { data, setData, processing, reset, transform, progress, patch, post, cancel, errors, clearErrors } = useForm({
		book: INITIAL_BOOK_STATE
	})

	const handleSubmit = () => {
		transform((latestData) => {
			const payload: Record<string, any> = { ...latestData.book }

			if (!(payload.cover instanceof File)) {
				delete payload.cover
			}

			payload.category_id = payload.category.id

			return { book: payload }
		})

		if (isEditing) {
			patch(`/admins/books/${activeBookId}`)
		} else {
			post(`/admins/books`, {
				onSuccess: () => handleClose(),
				onError: (e) => console.log(e)
			})
		}
	}

	const handleClose = () => {
		setActiveBookId(null)
		reset()
		setPreviewImageUrl(null)
	}

	useEffect(() => {
		if (!isOpen) return

		if (isEditing) {
			http.setData('id', activeBookId)
			http.get("/api/v1/admins/books", {
				onSuccess: (res: any) => {
					setData("book", {
						id: res.book.id,
						title: res.book.title,
						category: res.book.category,
						authors: res.book.authors,
						description: res.book.description,
						cover: null,
						wiki_url: res.book.wiki_url,
						epub: null
					})

					setAttachedEpubDetails(res.book.epub)
				}
			})
		} else {
			reset()
		}
	}, [activeBookId])

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{isEditing ? "Edit book" : "Add book"}</SheetTitle>
					<SheetDescription>
						{isEditing ? "Make changes to the book details." : "Add a new book to the database."}
					</SheetDescription>
				</SheetHeader>
				{http.processing && (
					<div className="flex-center h-full">
						<Spinner className="size-6" />
					</div>
				)}
				{!http.processing && (
					<FieldGroup className="flex flex-col auto-rows-min px-4 flex-1 overflow-y-auto">
						<Field>
							<FieldLabel>Title</FieldLabel>
							<Input
								value={data.book.title}
								placeholder="Enter the book's title"
								onChange={(e) => {
									setData('book.title', e.target.value)
									clearErrors('book.title')
								}}
								aria-invalid={!!errors["book.title"]}
							/>
							{errors['book.title'] && <FieldError>{errors["book.title"]}</FieldError>}
						</Field>
						<Field>
							<FieldLabel>Authors</FieldLabel>
							<AuthorsCombobox defaultAuthors={data.book.authors} onChange={(authors) => {
								setData('book.authors', authors as any)
								clearErrors('book.authors')
							}} isInvalid={!!errors["book.authors"]} />
							{errors['book.authors'] && <FieldError>{errors["book.authors"]}</FieldError>}
						</Field>
						<Field>
							<FieldLabel>Category</FieldLabel>
							<CategoryComboBox isInvalid={!!errors["book.category"]} defaultCategory={data.book.category} onChange={(category) => {
								setData('book.category', category as any)
								clearErrors('book.category')
							}} />
							{errors['book.category'] && <FieldError>{errors["book.category"]}</FieldError>}
						</Field>
						<Field>
							<FieldLabel>Tags</FieldLabel>
							<BookTagsComboBox />
						</Field>
						<Field>
							<FieldLabel>Description</FieldLabel>
							<Textarea
								placeholder="Add a wiki description"
								onChange={(e) => setData('book.description', e.target.value)}
								value={data.book.description}
								aria-invalid={!!errors["book.description"]}
							/>
							{errors["book.description"] && <FieldError>{errors["book.description"]}</FieldError>}
						</Field>
						<Field>
							<FieldLabel>Epub file</FieldLabel>
							<Attachment state="idle">
								<AttachmentMedia>
									{/* <Spinner /> */}
									<FileTextIcon />
								</AttachmentMedia>
								<AttachmentContent>
									{attachedEpubDetails !== null && (
										<Fragment>
											<AttachmentTitle>{attachedEpubDetails.filename.split('.')[0]}</AttachmentTitle>
											<AttachmentDescription>{attachedEpubDetails.filename.split('.').pop()?.toUpperCase()} • {formatBytes(attachedEpubDetails.byte_size)}</AttachmentDescription>
										</Fragment>
									)}
								</AttachmentContent>
								<AttachmentActions>
									<AttachmentAction><XIcon /></AttachmentAction>
								</AttachmentActions>
							</Attachment>
						</Field>
					</FieldGroup>
				)}
				{!http.processing && (
					<SheetFooter>
						<Button variant={processing ? "secondary" : "default"} disabled={processing} onClick={handleSubmit}>
							{processing && <Spinner />}
							{processing ? "Processing" : "Create"}
						</Button>
						<SheetClose render={<Button variant={"secondary"} onClick={cancel} />}>Cancel</SheetClose>
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	)
}