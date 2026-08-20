export interface Post {
	user: {
		username: string
		avatar_url: string
	},
	book: {
		title: string
		cover_url: string
		author_names: string
	}
	created_at: Date
	score: number
	body: string
}