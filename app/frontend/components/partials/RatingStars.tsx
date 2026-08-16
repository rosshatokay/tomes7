import { StarIcon } from "lucide-react"

interface RatingStarsProps {
	rating: number
	size?: number
}

export const RatingStars = ({ rating, size = 16 }: RatingStarsProps) => {
	return (
		<div className="flex">
			{Array.from({ length: 5 }).map((_, i) => (
				<StarIcon key={i} fill={i < rating ? "var(--foreground)" : "var(--subtle)"} className={i < rating ? "" : "opacity-70"} size={size} stroke={"none"} />
			))
			}
		</div>
	)
}