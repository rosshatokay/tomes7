import { cn } from "@/lib/utils"
import { Link } from "@inertiajs/react"
import { PropsWithChildren, useEffect, useRef, useState } from "react"

interface Props {
	href?: string,
	className?: string,
	target?: string,
	key?: string | number
	children: PropsWithChildren['children']
}

export const LinkUnderline = ({ href, key, children, className, target = "_self" }: Props) => {
	const [hoverState, setHoverState] = useState('idle');
	const timerRef = useRef<number | null>(null);

	const handleMouseEnter = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setHoverState('entering');
	};

	const handleMouseLeave = () => {
		if (hoverState !== 'entering') return;

		setHoverState('leaving');

		timerRef.current = setTimeout(() => {
			setHoverState('idle');
		}, 150);
	};

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const spanClass = cn(
		hoverState === 'entering' && 'hover-in',
		hoverState === 'leaving' && 'hover-out'
	);

	return (
		<Link
			className={cn("underliner w-fit", className)}
			target={target}
			href={href}
			key={key}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{children}
			<span className={spanClass}></span>
		</Link>
	);
}