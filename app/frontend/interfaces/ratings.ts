export default interface Rating {
	id?: string
	user: {
		username: string
		avatar_url: string
	},
	body: string
	score: number
	created_at: Date
}