import { useAdminHeader } from "@/components/contexts/AdminHeaderContext";
import BookSheet from "@/components/partials/admins/BookSheet";
import CustomTable, { Column } from "@/components/partials/CustomTable";
import { TablePagination } from "@/components/partials/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Book } from "@/interfaces/book";
import { PaginationMeta } from "@/interfaces/pagination";
import adminSearch from "@/lib/adminSearch";
import { cn } from "@/lib/utils";
import { Deferred, router } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { BookIcon, DownloadIcon, EyeIcon, FeatherIcon, FilterIcon, ListIcon, MoreHorizontalIcon, PlusIcon, SearchIcon, ShapesIcon, UsersIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PageProps {
	books_count: number
	books: Book[]
	pagination: PaginationMeta
}

export default function BooksPage({ books, books_count, pagination }: PageProps) {
	const { setHeaderContent } = useAdminHeader()
	const columns: Column[] = [
		{
			key: "title",
			label: {
				icon: <BookIcon size={14} />,
				text: "Book"
			},
			render: (row) => (
				<div className="flex items-center gap-3 min-w-[300px]">
					<img className="bg-card w-7 aspect-square object-cover rounded-sm" src={row.cover} />
					<span className="truncate">{row.title}</span>
				</div>
			)
		},
		{
			key: "author_names",
			label: {
				icon: <FeatherIcon size={14} />,
				text: "Authors"
			},
		},
		{
			key: "visibility",
			label: {
				icon: <EyeIcon size={14} />,
				text: "Visibility"
			},
			render: (row) => (
				<Badge variant={"secondary"} className={cn("text-sm font-normal", row.published ? "bg-green-500/20 text-green-700 dark:bg-green-300/20 dark:text-green-100" : "")}>{row.published ? "Published" : "Draft"}</Badge>
			)
		},
		{
			key: "readers_count",
			label: {
				icon: <UsersIcon size={14} />,
				text: "Readers"
			},
		},
		{
			key: "category",
			label: {
				icon: <ShapesIcon size={14} />,
				text: "Category"
			},
		},
	]

	const [activeBookId, setActiveBookId] = useState<string | null>(null)
	const { setSearchQuery } = adminSearch()

	useEffect(() => {
		setHeaderContent(
			<div className="flex items-center gap-2">
				<InputGroup>
					<InputGroupAddon><SearchIcon /></InputGroupAddon>
					<InputGroupInput
						type="text"
						placeholder="Search for a book"
						onChange={(e) => setSearchQuery(e.target.value)}
					></InputGroupInput>
				</InputGroup>
				<Button onClick={() => setActiveBookId('new')}>
					<PlusIcon /> Book
				</Button>
			</div>
		);

		// clean up to prevent leak
		return () => setHeaderContent(null);
	}, [setHeaderContent])

	return (
		<>
			<div className="h-full flex flex-col">
				<div className="text-sm min-h-12 h-12 flex items-center justify-between px-4 border-b">
					<span className="text-subtle flex items-center gap-2"><ListIcon size={16} /> All books • {books_count}</span>
					<div className="flex gap-1">
						<Button size={"sm"} variant={"ghost"}><FilterIcon /> Filter</Button>
						<Button size={"icon-sm"} variant={"ghost"}><DownloadIcon /></Button>
					</div>
				</div>
				<Deferred data="books" fallback={<div className="flex-center h-full"><Spinner className="size-6 text-subtle"></Spinner></div>}>
					<div className="w-full h-full overflow-y-auto">
						<CustomTable columns={columns} rows={books || []} onRowClick={(book: Book) => setActiveBookId(book.id)} />
					</div>
				</Deferred>
				<BookSheet activeBookId={activeBookId} setActiveBookId={setActiveBookId} />
				<TablePagination meta={pagination} />
			</div>
		</>
	)
}