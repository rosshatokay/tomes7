import { Logo } from "@/assets/Logo"
import { LogoText } from "@/assets/LogoText"
import { Link } from "@inertiajs/react"

const footerNavLinks = [
	{
		label: "Explore",
		items: [
			{ label: "Literature", path: "/books?tab=literature" },
			{ label: "History", path: "/books?tab=history" },
			{ label: "Religion & Philosophy", path: "/books?tab=religion-philosophy" },
			{ label: "See all", path: "/books" },
		]
	},
	{
		label: "Platform",
		items: [
			{ label: "About", path: "/about" },
			{ label: "Terms of use", path: "/terms" },
			{ label: "Privacy policy", path: "/privacy" },
			{ label: "Feedback", link: "mailto:hey@tomes.club" },
			{ label: "Community guidelines", path: "/community-guidelines" },
		]
	},
]

export const Footer = () => {
	return (
		<footer className="large-container flex flex-col gap-8 md:mt-25 mt-12 pb-5">
			<div className="flex flex-col md:grid grid-cols-12 md:gap-4 gap-8">
				<div className="flex flex-col h-full w-full col-span-6 md:gap-0 gap-6">
					<div className="opacity-50">
						<Logo size={24} />
					</div>
					<div className="mt-auto text-sm text-subtle">
						<p>Read the greatest books of all time — for free. <br /> © 2026 Tomes. All rights reserved.</p>
					</div>
				</div>
				<div className="flex flex-col md:grid grid-cols-2 md:gap-4 gap-8 col-span-4 col-start-7">
					{footerNavLinks.map(group => (
						<div key={group.label} className="flex flex-col gap-1">
							<h4>{group.label}</h4>
							{group.items.map(item => (
								item.link ? <a key={item.link} className="text-subtle w-fit hover:text-foreground transition" href={item.link}>{item.label}</a> 
								: <Link key={item.path} href={item.path} className="text-subtle w-fit hover:text-foreground transition">{item.label}</Link>
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