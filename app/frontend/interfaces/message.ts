export default interface Message {
	id: string
	created_at: Date
	user: {
		username: string
		avatar_url: string | null
	},
	content: {
		body: string
		subject: string
	}
}