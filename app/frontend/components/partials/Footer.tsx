import { Logo } from "@/assets/Logo"
import { LogoIcon } from "@/assets/LogoIcon"
import { LogoText } from "@/assets/LogoText"
import { Link } from "@inertiajs/react"
import { LinkUnderline } from "./LinkUnderline"

const footerNavLinks = [
	{
		label: "Explore",
		items: [
			{ label: "Literature", path: "/categories/literature" },
			{ label: "History", path: "/categories/history" },
			{ label: "Religion & Philosophy", path: "/categories/religion-philosophy" },
			{ label: "See all", path: "/categories" },
		]
	},
	{
		label: "Platform",
		items: [
			{ label: "About", path: "/about" },
			{ label: "Feedback", path: "mailto:hey@tomes.club" },
			{ label: "Community guidelines", path: "/community-guidelines" },
		]
	},
]

export const Footer = () => {
	return (
		<footer className="large-container flex flex-col gap-8 mt-25 pb-5">
			<div className="grid grid-cols-12 gap-4">
				<div className="flex flex-col h-full w-full col-span-6">
					<Logo size={24} />
					<div className="mt-auto text-sm text-subtle">
						<p>Read the greatest books of all time — for free. <br /> © 2026 Tomes. All rights reserved.</p>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4 col-span-4 col-start-9">
					{footerNavLinks.map(group => (
						<div key={group.label} className="flex flex-col gap-1">
							<h4>{group.label}</h4>
							{group.items.map(item => (
								<Link key={item.path} href={item.path} className="text-subtle hover:text-foreground transition">{item.label}</Link>
							))}
						</div>
					))}
				</div>
			</div>
			<div className="relative opacity-50">
				<div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-[var(--background)] to-transparent from-10% z-1"></div>
				<div className="logo-screen">
					<LogoText />
				</div>
			</div>
		</footer>
	)
}