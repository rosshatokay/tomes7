import { Combobox } from "@/components/ui/combobox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useForm, useHttp } from "@inertiajs/react"
import { useRef, useState } from "react"
import { CategoryComboBox } from "./Comboboxes"

const INITIAL_BOOK_STATE = {
	id: null as string | null,
	title: "",
	category_id: "",
	author_ids: [],
	description: "",
	cover: null as File | string | null,
	wiki_url: ""
}

interface Props {
	activeBookId: string | "new" | null
	setActiveBookId: (id: string | "new" | null) => void
}

export default function BookSheet({ activeBookId, setActiveBookId }: Props) {
	const http = useHttp({ id: "" })
	const isEditing = activeBookId !== null && activeBookId !== "new"
	const isOpen = activeBookId !== null
	const imageFileInputRef = useRef<HTMLInputElement>(null)
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

	const { data, setData, reset } = useForm()

	const handleClose = () => {
		setActiveBookId(null)
		reset()
		setPreviewImageUrl(null)
	}

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{isEditing ? "Edit book" : "Add book"}</SheetTitle>
					<SheetDescription>
						{isEditing ? "Make changes to the book details." : "Add a new book to the database."}
					</SheetDescription>
				</SheetHeader>
				<FieldGroup className="grid auto-rows-min px-4 flex-1 overflow-y-auto">
					<Field>
						<FieldLabel>Title</FieldLabel>
						<Input placeholder="Enter the book's title" />
					</Field>
					<Field>
						<FieldLabel>Category</FieldLabel>
						<CategoryComboBox />
					</Field>
				</FieldGroup>
			</SheetContent>
		</Sheet>
	)
}