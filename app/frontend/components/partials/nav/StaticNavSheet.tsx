import { LogoIcon } from "@/assets/LogoIcon";
import { LogoText } from "@/assets/LogoText";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@inertiajs/react";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import strftime from "strftime";

export default function StaticNavSheet() {
	const [isOpen, setIsOpen] = useState(false)
	const links = {
		main: [
			{ label: "Home", path: "/" },
			{ label: "Explore", path: "/explore" },
		],
		secondary: [
			{ label: "About", path: "/about" },
			{ label: "Community guideliens", path: "/community-guidelines" },
			{ label: "Terms of service", path: "/terms" },
			{ label: "Privacy policy", path: "/privacy" },
			{ label: "Join for free", path: "/signup" },
			{ label: "Sign in", path: "/login" },
		]
	}

	return (
		<Sheet open={isOpen} onOpenChange={open => !open && setIsOpen(open)}>
			<SheetTrigger render={<Button size={"icon"} variant={"ghost"} />} onClick={() => setIsOpen(true)}><MenuIcon /></SheetTrigger>
			<SheetContent className={"p-6 pt-16"}>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-3">
						{links.main.map(item => (
							<Link href={item.path} key={item.path} onClick={() => setIsOpen(false)} className="text-lg">{item.label}</Link>
						))}
					</div>
					<hr />
					<div className="flex flex-col gap-3">
						{links.secondary.map(item => (
							<Link href={item.path} key={item.path} onClick={() => setIsOpen(false)} className="text-base text-subtle hover:text-foreground">{item.label}</Link>
						))}
					</div>
				</div>
				<div className="mt-auto">
					<div className="mb-2 flex items-center gap-2">
						<LogoIcon fill="var(--subtle)" size={20} />
						<div className="h-4">
							<LogoText fill="var(--subtle)" />
						</div>
					</div>
					<p className="text-subtle text-sm">© {strftime('%Y', new Date())} Tomes. All rights reserved.</p>
				</div>
			</SheetContent>
		</Sheet>
	)
}