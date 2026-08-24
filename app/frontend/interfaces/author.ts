export default interface Author {
	id: string
	full_name: string
	created_at?: Date
	avatar_url: string
	books_count: number
	is_followed: boolean
	slug: string
	wiki_url: string
	followers_count: number
	bio: string
	share_url: string
	permalink: string
}