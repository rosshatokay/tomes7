import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Book } from "@/interfaces/book";
import AdminLayout from "@/layouts/AdminLayout";
import { Deferred } from "@inertiajs/react";

interface PageProps {
	books: Book[]
}

export default function BooksPage(props: PageProps) {
	return (
		<>
			<div className="max-w-5xl w-full mx-auto flex flex-col gap-12">
				hey
				<Deferred data="books" fallback={<div className="flex-center"><Spinner className="size-8"></Spinner></div>}>
					<Table>
						<TableHeader>
							<TableRow className="border-none">
								<TableHead className="text-neutral-400 text-base min-w-[400px]">Book</TableHead>
								<TableHead className="text-neutral-400 text-base">Authors</TableHead>
								<TableHead className="text-neutral-400 text-base">Visibility</TableHead>
								<TableHead className="text-neutral-400 text-base"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{props.books?.map((book, i) => (
								<TableRow key={i}>
									<TableCell className="flex items-center gap-6 min-w-px">
										<div className="w-12 rounded-lg aspect-book bg-surface" style={{ background: `url(${book.cover}) center / cover` }}></div>
										<div>
											<div className="font-normal text-base">{book.title}</div>
										</div>
									</TableCell>
									<TableCell className="text-base">{book.author_names}</TableCell>
									<TableCell className="text-base">{book.published ? <Badge variant="secondary" className="text-sm h-7 p-3 text-neutral-200 bg-green-400/10 text-green-100">Published</Badge> : <div>not</div>}</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><i className="ph ph-dots-three text-xl"></i></Button>}></DropdownMenuTrigger>
											<DropdownMenuContent side="bottom" align="end">
												<DropdownMenuItem>View</DropdownMenuItem>
												<DropdownMenuItem>Share</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Deferred>
			</div>
		</>
	)
}

BooksPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>