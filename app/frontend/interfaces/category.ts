type CategorySlugs = "literature" | "history" | "arts-culture" | "religion-philosophy" | "science-technology" | "social-sciences-society" | "lifestyle-hobbies" | "health-medicine" | "education-reference"

export interface Category {
	name: string
	slug: CategorySlugs
}