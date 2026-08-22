import AuthorSheet from "@/components/partials/admins/AuthorSheet"
import CustomTable, { Column } from "@/components/partials/CustomTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import Author from "@/interfaces/author"
import { Deferred, Head } from "@inertiajs/react"
import { CalendarIcon, FeatherIcon, HashIcon, ListIcon } from "lucide-react"
import { useState } from "react"
import { format } from "timeago.js"

interface PageProps {
	authors_count: number
	authors: Author[]
}

export default function AuthorsPage({ authors, authors_count }: PageProps) {
	const [activeAuthorId, setActiveAuthorId] = useState<string | null>(null)

	const columns: Column[] = [
		{
			key: "full_name",
			label: {
				icon: <FeatherIcon size={14} />,
				text: "Author"
			},
			render: (row) => (
				<div className="flex items-center gap-2">
					<Avatar className={"size-6"}>
						<AvatarImage src={row.avatar_url} />
						<AvatarFallback className={"text-xs"}>{row.full_name[0]}</AvatarFallback>
					</Avatar>
					{row.full_name}
				</div>
			)
		},
		{
			key: "books_count",
			label: {
				icon: <HashIcon size={14} />,
				text: "Books"
			},
		},
		{
			key: "created_at",
			label: {
				icon: <CalendarIcon size={14} />,
				text: "Created at"
			},
			render: (row) => (
				<span>{format(row.created_at)}</span>
			)
		}
	]

	const handleRowClick = (author: Author) => {
		setActiveAuthorId(author.id)
	}

	return (
		<>
			<Head>
				<title>Authors</title>
			</Head>
			<div className="h-full">
				<div className="text-sm h-12 flex items-center justify-between px-4 border-b">
					<span className="text-subtle flex items-center gap-2"><ListIcon size={16} /> All authors • {authors_count}</span>
					<Button size={"sm"} variant={"secondary"} onClick={() => setActiveAuthorId("new")}>Add author</Button>
				</div>
				<Deferred data={"authors"} fallback={<div className="flex-center h-full"><Spinner className="size-6 text-subtle" /></div>}>
					<CustomTable columns={columns} rows={authors} onRowClick={handleRowClick} />
				</Deferred>
				<AuthorSheet activeAuthorId={activeAuthorId} setActiveAuthorId={setActiveAuthorId} />
			</div>
		</>
	)
}