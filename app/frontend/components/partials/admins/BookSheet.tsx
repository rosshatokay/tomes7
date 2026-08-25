import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useForm, useHttp } from "@inertiajs/react"
import { Fragment, useEffect, useRef, useState } from "react"
import { AuthorsCombobox, BookTagsComboBox, CategoryComboBox } from "./Comboboxes"
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/spinner"
import { FileTextIcon, ImagePlusIcon, LockOpenIcon, TrashIcon, UploadCloudIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatBytes } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
	},
	details: {} as Record<string, string>,
	published: false
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

	const epubFileInputRef = useRef<HTMLInputElement>(null)
	const imageFileInputRef = useRef<HTMLInputElement>(null)
	const [attachedEpubDetails, setAttachedEpubDetails] = useState<attachedEpub | null>(null)
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

	const { data, setData, processing, reset, transform, progress, put, post, cancel, errors, clearErrors } = useForm({
		book: INITIAL_BOOK_STATE
	})

	const handleEpubFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setData('book.epub', file)

		setAttachedEpubDetails({
			filename: file.name,
			byte_size: file.size
		})
	}

	const handleSubmit = () => {
		transform((latestData) => {
			const payload: Record<string, any> = { ...latestData.book }

			// if not new file, don't send it as raw file
			if (!(payload.cover instanceof File)) {
				delete payload.cover
			}

			// if not new file, don't send it as raw file
			if (!(payload.epub instanceof File)) {
				delete payload.epub
			}

			payload.category_id = payload.category.id

			return { book: payload }
		})

		if (isEditing) {
			put(`/admins/books/${activeBookId}`, {
				onSuccess: (res) => handleClose(),
				onError: (e) => console.error(e)
			})
		} else {
			post(`/admins/books`, {
				onSuccess: () => handleClose(),
				onError: (e) => console.log(e)
			})
		}
	}

	const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (file && file.type.startsWith("image/")) {
			const url = URL.createObjectURL(file)
			setPreviewImageUrl(url)
			setData("book.cover", file)
		}
	}

	const handleClose = () => {
		setActiveBookId(null)
		reset()
		setPreviewImageUrl(null)
	}

	const handleRemoveDetail = (keyToRemove: string) => {
		const updatedDetails = { ...data.book.details }
		delete updatedDetails[keyToRemove]

		setData('book', {
			...data.book,
			details: updatedDetails
		})
	}

	const handleDetailChange = (oldKey: string, newKey: string, value: string) => {
		const updatedDetails: Record<string, string> = {}

		// Rebuild object in original key order
		for (const [key, val] of Object.entries(data.book.details)) {
			if (key === oldKey) {
				updatedDetails[newKey] = value
			} else {
				updatedDetails[key] = val
			}
		}

		setData('book', {
			...data.book,
			details: updatedDetails,
		})
	}

	const handleAddDetail = () => {
		setData('book', {
			...data.book,
			details: { ...data.book.details, '': '' }
		})
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
						epub: null,
						published: res.book.published,
						details: {
							"Title": "",
							"Translator": "",
							"Language": "",
							"Publication date": "",
							...(res.book.details || {})
						}
					})

					setPreviewImageUrl(res.book.cover_url ?? null)
					setAttachedEpubDetails(res.book.epub)
				}
			})
		} else {
			reset()
		}
	}, [activeBookId])

	console.log(data.book.details)

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className={"!max-w-3xl w-full h-full max-h-[90vh] flex flex-col"}>
				<DialogHeader className="pb-4">
					<DialogTitle>{isEditing ? "Edit book" : "Add book"}</DialogTitle>
				</DialogHeader>
				{http.processing && (
					<div className="flex-center h-full">
						<Spinner className="size-6" />
					</div>
				)}
				{!http.processing && (
					<div className="overflow-y-auto -m-4">
						<div className="grid grid-cols-[150px_1fr] pt-0 p-4 gap-8">
							<Field className="gap-4">
								<div
									onClick={() => imageFileInputRef.current?.click()}
									className="w-16 aspect-book rounded-sm bg-card border-2 border-transparent hover:border-foreground/50 transition cursor-pointer">
									{previewImageUrl ? (
										<div className="w-full h-full" style={{ background: `url(${previewImageUrl}) center / cover` }}></div>
									) : (
										<div className="w-full h-full flex-center text-subtle"><ImagePlusIcon size={16} /></div>
									)}
								</div>
								<Input
									ref={imageFileInputRef}
									onChange={handleImageFileChange}
									type="file"
									accept="image/*"
									className="hidden"
								/>
								{/* <Button onClick={() => imageFileInputRef.current?.click()} variant={"secondary"}>
									Upload image
								</Button> */}
							</Field>
							<FieldGroup className="flex flex-col auto-rows-min flex-1 overflow-hidden gap-5 px-1">
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
									<FieldLabel>Wiki URL</FieldLabel>
									<Input
										type="text"
										onChange={(e) => setData("book.wiki_url", e.target.value)}
										placeholder="Enter the book's wikipedia URL"
										value={data.book.wiki_url}
									/>
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
									<div className="flex items-center justify-between mb-2">
										<FieldLabel>Additional details</FieldLabel>
										<button
											type="button"
											onClick={handleAddDetail}
											className="text-sm text-foreground hover:underline"
										>
											+ Add Detail
										</button>
									</div>

									<div className="space-y-2">
										{Object.entries(data.book.details).map(([key, value], index) => (
											<div key={index} className="flex gap-2 items-center">
												<Input
													type="text"
													placeholder="Key (e.g. Translator)"
													value={key}
													onChange={(e) => handleDetailChange(key, e.target.value, value)}
												/>
												<Input
													type="text"
													placeholder="Value"
													value={value}
													onChange={(e) => handleDetailChange(key, key, e.target.value)}
												/>
												<Button
													type="button"
													onClick={() => handleRemoveDetail(key)}
													variant={"ghost"}
													size={"icon-sm"}
												><TrashIcon /></Button>
											</div>
										))}
										{Object.keys(data.book.details).length === 0 && (
											<p className="text-sm text-gray-500 italic">No additional details added yet.</p>
										)}
									</div>
								</Field>
								<Field>
									<FieldLabel>Epub file</FieldLabel>
									{(data.book.epub !== null || attachedEpubDetails !== null) && (
										<Attachment state="idle">
											<AttachmentMedia>
												{progress ? <Spinner /> : <FileTextIcon />}
											</AttachmentMedia>
											<AttachmentContent>
												{attachedEpubDetails !== null && (
													<Fragment>
														<AttachmentTitle>{attachedEpubDetails.filename.split('.')[0]}</AttachmentTitle>
														{progress ? (
															<AttachmentDescription>Uploading • {Math.trunc(progress.percentage || 0)}%</AttachmentDescription>
														) : (

															<AttachmentDescription>{attachedEpubDetails.filename.split('.').pop()?.toUpperCase()} • {formatBytes(attachedEpubDetails.byte_size)}</AttachmentDescription>
														)}
													</Fragment>
												)}
											</AttachmentContent>
											<AttachmentActions>
												<AttachmentAction><XIcon /></AttachmentAction>
											</AttachmentActions>
										</Attachment>
									)}
									{data.book.epub === null && attachedEpubDetails === null && (
										<Fragment>
											<Input
												ref={epubFileInputRef}
												onChange={(e) => {
													handleEpubFile(e)
													clearErrors("book.epub")
												}}
												accept="application/epub+zip"
												type="file"
												className="hidden"
											/>
											<div className="border border-dashed p-4 pt-5 rounded-lg flex-center flex-col gap-2" onClick={() => epubFileInputRef.current?.click()}>
												<UploadCloudIcon size={20} />
												<div className="text-xs">Click to upload</div>
											</div>
										</Fragment>
									)}
									{errors["book.epub"] && <FieldError>{errors["book.epub"]}</FieldError>}
								</Field>
								<div>
									<div className="text-sm text-subtle mb-2">Access</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-10 aspect-square rounded-md border border-foreground/10 flex-center">
												<LockOpenIcon size={16} className="text-subtle" />
											</div>
											<div>
												<div>Mark published</div>
												<div className="text-xs text-subtle">Make the book visible to everyone.</div>
											</div>
										</div>
										<Switch checked={data.book.published} onCheckedChange={(checked) => setData('book.published', checked)} />
									</div>
								</div>
							</FieldGroup>
						</div>
					</div>
				)}
				{!http.processing && (
					<DialogFooter className="flex flex-row justify-end p-4 py-3">
						<SheetClose render={<Button variant={"secondary"} onClick={cancel} />}>Cancel</SheetClose>
						<Button variant={processing ? "secondary" : "default"} disabled={processing} onClick={handleSubmit}>
							{processing && <Spinner />}
							{processing && "Processing"}
							{!processing && (
								isEditing ? "Save" : "Create"
							)}
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog >
	)
}