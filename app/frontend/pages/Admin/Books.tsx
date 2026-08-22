import { useAdminHeader } from "@/components/contexts/AdminHeaderContext";
import BookSheet from "@/components/partials/admins/BookSheet";
import CustomTable, { Column } from "@/components/partials/CustomTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Book } from "@/interfaces/book";
import { Deferred } from "@inertiajs/react";
import { BookIcon, EyeIcon, FeatherIcon, ListIcon, MoreHorizontalIcon, PlusIcon, ShapesIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface PageProps {
	books_count: number
	books: Book[]
}

export default function BooksPage({ books, books_count }: PageProps) {
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
				<Badge variant={"secondary"} className="text-sm font-normal">{row.published ? "Published" : "Draft"}</Badge>
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

	useEffect(() => {
    setHeaderContent(
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setActiveBookId('new')}>
          <PlusIcon /> Add book
        </Button>
      </div>
    );

		// clean up to prevent leak
    return () => setHeaderContent(null);
  }, [setHeaderContent])
	
	return (
		<>
			<div className="h-full">
				<div className="text-sm h-12 flex items-center px-4 border-b">
					<span className="text-subtle flex items-center gap-2"><ListIcon size={16} /> All books • {books_count}</span>
				</div>
				<Deferred data="books" fallback={<div className="flex-center h-full"><Spinner className="size-6 text-subtle"></Spinner></div>}>
					<CustomTable columns={columns} rows={books || []} onRowClick={(book: Book) => setActiveBookId(book.id)} />
				</Deferred>
				<BookSheet activeBookId={activeBookId} setActiveBookId={setActiveBookId} />
			</div>
		</>
	)
}