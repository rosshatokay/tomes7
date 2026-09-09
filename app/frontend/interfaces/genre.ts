type GenreSlugs = "literature" | "history" | "arts-culture" | "religion-philosophy" | "science-technology" | "social-sciences-society" | "lifestyle-hobbies" | "health-medicine" | "education-reference"

export interface Genre {
	name: string
	slug: GenreSlugs
	permalink: string
}