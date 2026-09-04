import { cn } from "@/lib/utils"

interface Props {
	title: string | React.ReactNode
	description: string
	content?: React.ReactNode
	className?: string
}

export default function MainHeader({ title, description, content, className }: Props) {
	return (
		<div className={cn("large-container flex-center flex-col h-[30vh] md:min-h-80 min-h-64", className)}>
			<h1 className="md:text-5xl text-4xl md:mb-4 mb-2 font-headline text-center">{title}</h1>
			<p className="text-subtle md:text-base text-[15px]">{description}</p>
			{content && content}
		</div>
	)
}