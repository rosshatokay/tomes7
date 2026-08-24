import { AuthProps } from "@/interfaces/auth";
import { PropsWithChildren } from "react";

interface ReaderLayoutProps {
	auth?: AuthProps
	children: PropsWithChildren['children']
}

export default function ReaderLayout({ children, auth }: ReaderLayoutProps) {
	return (
		<div>
			<main>
				{children}
			</main>
		</div>
	)
}