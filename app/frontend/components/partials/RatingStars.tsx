import { StarIcon } from "lucide-react"

interface RatingStarsProps {
	rating: number
	size?: number
}

export const RatingStars = ({ rating, size = 16 }: RatingStarsProps) => {
	const roundedRating = Math.round(rating)
	
	return (
		<div className="flex">
			{Array.from({ length: 5 }).map((_, i) => (
				<StarIcon key={i} fill={i < roundedRating ? "var(--foreground)" : "var(--subtle)"} className={i < roundedRating ? "" : "opacity-70"} size={size} stroke={"none"} />
			))
			}
		</div>
	)
}