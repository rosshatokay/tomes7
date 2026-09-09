import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";
import { useHttp } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { Fragment, useEffect, useState } from "react";

type Author = {
	id: number
	full_name: string
	avatar_url: string
}

type Tag = {
	id: number | string
	name: string
}

type Genre = {
	name: string
	id: number | null
}

export function GenreComboBox({
	defaultGenre,
	onChange,
	isInvalid = false
}: {
	defaultGenre?: Genre,
	onChange?: (genre: Genre) => void,
	isInvalid?: boolean
}) {
	const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
	const [genres, setGenres] = useState<Genre[]>([])
	const { get, processing } = useHttp({})

	useEffect(() => {
		get("/api/v1/admins/genres", {
			onSuccess: (res: any) => setGenres(res.genres)
		})
	}, [])

	return (
		<Combobox
			items={genres}
			value={selectedGenre || defaultGenre}
			onValueChange={(value) => {
				onChange ? onChange(value as any) : undefined
				setSelectedGenre(value)
			}}
			itemToStringLabel={(genre: Genre) => genre?.name ?? ""}
			itemToStringValue={(genre: Genre) => genre ? String(genre.id) : ""}
		>
			<ComboboxInput placeholder="Select a genre" aria-invalid={isInvalid} />
			<ComboboxContent>
				<ComboboxEmpty>
					{processing ? "Searching..." : "No items found."}
				</ComboboxEmpty>
				<ComboboxList>
					{(genre) => (
						<ComboboxItem key={genre.id} value={genre}>
							{genre.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	)
}

export function BookTagsComboBox({
	defaultTags,
	onChange,
	isInvalid = false
}: {
	defaultTags: Tag[],
	onChange?: (tags: Tag[] | null) => void,
	isInvalid?: boolean
}) {
	const [tags, setTags] = useState<Tag[]>([])
	const [selectedTags, setSelectedTags] = useState<Tag[] | null>(null)
	const [searchQuery, setSearchQuery] = useState<string>("")
	const { get, processing } = useHttp({})
	const anchor = useComboboxAnchor()

	const debouncedSearchQuery = useDebounce(searchQuery, 300)

	useEffect(() => {
		if (debouncedSearchQuery.trim() === "") {
			setTags([])
			return
		}

		get(`/api/v1/admins/tags/search?q=${encodeURIComponent(debouncedSearchQuery)}`, {
			onSuccess: (res: any) => {
				setTags(res.results as Tag[])
			}
		})
	}, [debouncedSearchQuery])

	const currentTags = selectedTags || defaultTags

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && searchQuery.trim() !== "") {
			e.preventDefault()
			const trimmedQuery = searchQuery.trim().toLowerCase()

			const alreadySelected = currentTags.some(
				(tag) => tag.name.toLowerCase() === trimmedQuery
			)

			if (!alreadySelected) {
				const newTag: Tag = { id: `temp-${Date.now()}`, name: trimmedQuery }

				const updated = [...currentTags, newTag]
				setSelectedTags(updated)
				onChange?.(updated)
				setSearchQuery("")
				setTags([])
			}
		}
	}

	return (
		<Combobox
			items={tags}
			itemToStringValue={(tag: Tag) => tag.name}
			onValueChange={(v) => {
				setSelectedTags(v)
				onChange ? onChange(v) : undefined
			}}
			autoHighlight
			multiple
			value={currentTags}
		>
			<ComboboxChips ref={anchor} className={"w-full"}>
				<ComboboxValue>
					{(tags: Tag[]) => (
						<Fragment>
							{tags?.map((tag) => (
								<ComboboxChip key={tag.id}>{tag.name}</ComboboxChip>
							))}
							<ComboboxChipsInput
								aria-invalid={isInvalid}
								placeholder="Search for a tag"
								className={"p-0 border-none !shadow-[none] text-sm ring-none"}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={handleKeyDown}
							/>
						</Fragment>
					)}
				</ComboboxValue>
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>
					{processing ? "Searching..." : "No items found."}
				</ComboboxEmpty>
				<ComboboxList>
					{(tag) => (
						<ComboboxItem key={tag.id} value={tag}>
							{tag.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	)
}

export function AuthorsCombobox({
	defaultAuthors,
	onChange,
	isInvalid = false
}: {
	defaultAuthors: Author[],
	onChange?: (authors: Author[] | null) => void,
	isInvalid?: boolean
}) {
	const [authors, setAuthors] = useState<Author[]>([])
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [selectedAuthors, setSelectedAuthors] = useState<Author[] | null>(null)
	const { get, processing } = useHttp({})
	const anchor = useComboboxAnchor()

	const debouncedSearchQuery = useDebounce(searchQuery, 300)

	useEffect(() => {
		if (debouncedSearchQuery.trim() === "") {
			setAuthors([])
			return
		}

		get(`/api/v1/admins/authors/search?q=${encodeURIComponent(debouncedSearchQuery)}`, {
			onSuccess: (res: any) => {
				setAuthors(res.results as Author[])
			}
		})
	}, [debouncedSearchQuery])

	return (
		<Combobox
			items={authors}
			itemToStringValue={(author: Author) => author.full_name}
			autoHighlight
			multiple
			onValueChange={(v) => {
				setSelectedAuthors(v)
				onChange ? onChange(v) : undefined
			}}
			value={selectedAuthors || defaultAuthors}
		>
			<ComboboxChips ref={anchor} className={"w-full"}>
				<ComboboxValue>
					{(authors: Author[]) => (
						<Fragment>
							{authors.map((author) => (
								<ComboboxChip key={author.id}>
									<Avatar className={"size-5"}>
										<AvatarImage src={author.avatar_url} />
										<AvatarFallback>{author.full_name[0]}</AvatarFallback>
									</Avatar>
									{author.full_name}
								</ComboboxChip>
							))}
							<ComboboxChipsInput aria-invalid={isInvalid} placeholder="Search for an author" className={"p-0 border-none !shadow-[none] text-sm ring-none"} onChange={(e) => setSearchQuery(e.target.value)} />
						</Fragment>
					)}
				</ComboboxValue>
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>
					{processing ? "Searching..." : "No items found."}
				</ComboboxEmpty>
				<ComboboxList>
					{(author) => (
						<ComboboxItem key={author.id} value={author}>
							<Avatar className={"size-5"}>
								<AvatarImage src={author.avatar_url} />
								<AvatarFallback>{author.full_name[0]}</AvatarFallback>
							</Avatar>
							{author.full_name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	)
}