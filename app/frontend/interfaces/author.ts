export default interface Author {
	id: string
	full_name: string
	created_at?: Date
	avatar_url: string
	books_count: number
	is_followed: boolean
	slug: string
	permalink: string
}