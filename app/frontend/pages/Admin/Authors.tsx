import { useAdminHeader } from "@/components/contexts/AdminHeaderContext"
import AuthorSheet from "@/components/partials/admins/AuthorSheet"
import CustomTable, { Column } from "@/components/partials/CustomTable"
import { TablePagination } from "@/components/partials/TablePagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import Author from "@/interfaces/author"
import { PaginationMeta } from "@/interfaces/pagination"
import adminSearch from "@/lib/adminSearch"
import { Deferred, Head } from "@inertiajs/react"
import { CalendarIcon, FeatherIcon, HashIcon, ListIcon, PlusIcon, SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "timeago.js"

interface PageProps {
	authors_count: number
	authors: Author[]
	pagination: PaginationMeta
}

export default function AuthorsPage({ authors, authors_count, pagination }: PageProps) {
	const [activeAuthorId, setActiveAuthorId] = useState<string | null>(null)
	const { setHeaderContent } = useAdminHeader()
	const { setSearchQuery } = adminSearch()

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

	useEffect(() => {
		setHeaderContent(
			<div className="flex items-center gap-2">
				<InputGroup>
					<InputGroupAddon><SearchIcon /></InputGroupAddon>
					<InputGroupInput
						type="text"
						placeholder="Search for an author"
						onChange={(e) => setSearchQuery(e.target.value)}
					></InputGroupInput>
				</InputGroup>
				<Button onClick={() => setActiveAuthorId("new")}><PlusIcon /> Author</Button>
			</div>
		);

		// clean up to prevent leak
		return () => setHeaderContent(null);
	}, [setHeaderContent])

	return (
		<>
			<Head>
				<title>Authors</title>
			</Head>
			<div className="h-full flex flex-col">
				<div className="text-sm min-h-12 h-12 flex items-center justify-between px-4 border-b">
					<span className="text-subtle flex items-center gap-2"><ListIcon size={16} /> All authors • {authors_count}</span>
				</div>
				<Deferred data={"authors"} fallback={<div className="flex-center h-full"><Spinner className="size-6 text-subtle" /></div>}>
					<div className="w-full h-full overflow-y-auto">
						<CustomTable columns={columns} rows={authors} onRowClick={handleRowClick} />
					</div>
				</Deferred>
				<AuthorSheet activeAuthorId={activeAuthorId} setActiveAuthorId={setActiveAuthorId} />
				<TablePagination meta={pagination} />
			</div>
		</>
	)
}