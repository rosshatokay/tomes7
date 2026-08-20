export interface Book {
	title: string
	cover: string
	author_names: string
	category: string
	published?: boolean
	permalink: string
	id: string
	readers_count?: number
	average_rating: number
	ratings_count: number
}