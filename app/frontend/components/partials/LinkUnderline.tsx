import { cn } from "@/lib/utils"
import { Link } from "@inertiajs/react"
import { PropsWithChildren, useState } from "react"

interface Props {
	href?: string, 
	key?: string | number
	children: PropsWithChildren['children']
}

export const LinkUnderline = ({ href, key, children }: Props) => {
	const [mouseIn, setMouseIn] = useState<boolean>(false)
	
	return (
		<Link className="underliner w-fit" href={href} key={key} onMouseEnter={() => setMouseIn(true)} onMouseLeave={() => setMouseIn(false)}>
			{children}
			<span className={cn(mouseIn ? "hover-in" : "hover-out")}></span>
		</Link>
	)
}