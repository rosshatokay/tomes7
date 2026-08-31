import { cn } from "@/lib/utils"
import { StarIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface RatingStarsProps {
	rating: number
	size?: number
}

export const RatingStars = ({ rating, size = 16 }: RatingStarsProps) => {
	const roundedRating = Math.round(rating)

	return (
		<div className="flex">
			{
				Array.from({ length: 5 }).map((_, i) => (
					<StarIcon key={i} fill={i < roundedRating ? "var(--foreground)" : "var(--subtle)"} className={i < roundedRating ? "" : "opacity-40"} size={size} stroke={"none"} />
				))
			}
		</div>
	)
}

export const RatingStarsSlider = ({
	size = 16,
	onChange
}: {
	size?: number
	onChange?: (score: number) => void
}) => {
	const [score, setScore] = useState(0)
	const [hoverIndex, setHoverIndex] = useState(0)

	useEffect(() => {
		if (score < 1 || score > 5) return

		onChange ? onChange(score) : undefined
	}, [score])

	return (
		<div className="flex w-fit cursor-pointer" onMouseLeave={() => score === 0 ? setHoverIndex(0) : setHoverIndex(score)}>
			{
				Array.from({ length: 5 }).map((_, i) => (
					<StarIcon
						key={i}
						fill="var(--foreground)"
						size={size}
						stroke={"none"}
						onClick={() => setScore(i + 1)}
						onMouseEnter={() => setHoverIndex(i + 1)}
						className={cn("transition", i <= hoverIndex - 1 ? "" : "opacity-25")}
					/>
				))
			}
		</div>
	)
}