import { SearchIcon, SearchXIcon } from "lucide-react"
import { useDebounce } from "@uidotdev/usehooks";
import { Dialog, DialogContent } from "../ui/dialog"
import { useEffect, useState } from "react"
import { Link } from "@inertiajs/react";
import { Spinner } from "../ui/spinner";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";

interface SearchDialogProps {
	isOpen: boolean
	setIsOpen: (open: boolean) => void
}

interface SearchResult {
	book: {
		title: string
		cover_url: string
		author_names: string
	}
	author: {
		full_name: string
		avatar_url: string
	}
	genre: {
		name: string
		icon: string
	}
	score: number
	permalink: string
	type: "book" | "genre" | "author"
}

interface ResultItemProps {
	data: SearchResult
	onClick: () => void
}

const SearchResultItem = ({ data, onClick }: ResultItemProps) => {
	const wrapperClasses = "p-2 flex items-center gap-3 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition relative"

	if (data.type === 'book') {
		return (
			<div className={wrapperClasses} onClick={onClick}>
				<Link href={data.permalink} className="absolute inset-0 z-1" />
				<img className="aspect-book h-12 rounded-[3px] bg-card" src={data.book.cover_url} />
				<div>
					<h3 className="font-normal">{data.book.title}</h3>
					<p className="text-subtle text-sm">{data.book.author_names}</p>
				</div>
			</div>
		)
	}

	if (data.type === 'author') {
		return (
			<div className={wrapperClasses} onClick={onClick}>
				<Link href={data.permalink} className="absolute inset-0 z-1" />
				<img className="aspect-square w-9 rounded-[2px] rounded-full object-cover" src={data.author.avatar_url} />
				<div>
					<h3 className="font-normal">{data.author.full_name}</h3>
				</div>
			</div>
		)
	}

	if (data.type === 'genre') {
		return (
			<div className={wrapperClasses} onClick={onClick}>
				<Link href={data.permalink} className="absolute inset-0 z-1" />
				<div className="w-9 bg-card aspect-square rounded-md flex-center">{data.genre.icon}</div>
				<div>
					<h3 className="font-normal">{data.genre.name}</h3>
				</div>
			</div>
		)
	}
}

export const SearchDialog = ({ isOpen, setIsOpen }: SearchDialogProps) => {
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [results, setResults] = useState<SearchResult[] | null>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const debouncedQuery = useDebounce(searchQuery, 500)

	useEffect(() => {
		if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
			setResults([])
			return
		}

		const fetchSearchResults = async () => {
			setIsLoading(true)

			try {
				const response = await fetch(
					`/api/v1/search?q=${debouncedQuery}`
				)
				const data = await response.json()

				setResults(data.length === 0 ? null : data)
			} catch (err) {
				console.error("Error fetching search data:", err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchSearchResults()
	}, [debouncedQuery])

	const handleDialogClose = (open: boolean) => {
		if (!open) {
			setIsOpen(false)
			setResults([])
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={open => handleDialogClose(open)}>
			<DialogContent showCloseButton={false} className={"p-0 md:!max-w-lg h-[65vh] flex flex-col gap-0"}>
				<div className="relative h-fit border-b">
					<SearchIcon size={20} className="absolute top-1/2 -translate-y-1/2 left-4 text-subtle" />
					<input
						type="text"
						placeholder="Search books, authors, genres"
						className="bg-transparent h-12 pl-12 w-full text-[15px] !shadow-[none] border-none !focus:outline-none !ring-none"
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				{isLoading && <div className="flex-center h-full"><Spinner className="size-8" /></div>}
				{debouncedQuery.trim().length < 2 && (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant={"icon"}><SearchIcon /></EmptyMedia>
							<EmptyTitle>Search all of Tomes</EmptyTitle>
							<EmptyDescription>Find books, authors, and genres.</EmptyDescription>
						</EmptyHeader>
					</Empty>
				)}
				{!isLoading && results === null && (
					<div className="text-sm text-subtle text-center p-6">
						<SearchXIcon className="size-6 mx-auto mb-3" />
						<div>No results found.</div>
						<div>Try a different keyword.</div>
					</div> 
				)}
				{!isLoading && results && results.length > 0 && <div className="p-2 h-fit">
					<div className="text-sm text-subtle px-2 mb-1">Results</div>
					{results?.map((result: SearchResult, index) => (
						<SearchResultItem key={index} data={result} onClick={() => setIsOpen(false)} />
					))}
				</div>}
			</DialogContent>
		</Dialog>
	)
}