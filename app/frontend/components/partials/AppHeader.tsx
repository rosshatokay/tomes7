import { LogoIcon } from "@/assets/LogoIcon";
import { Button } from "../ui/button";
import { BellIcon, SearchIcon } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { AuthProps } from "@/interfaces/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SearchDialog } from "./SearchDialog";
import { useState } from "react";
import NotificationsPopover from "./NotificationsPopover";
import TopProfileMenu from "./TopProfileMenu";

export default function AppHeader(auth?: AuthProps) {
	const { url } = usePage()
	const user = auth?.user
	const navLinks = [
		{ label: user ? "Library" : "Books", path: "/" },
		{ label: "Authors", path: "/authors" }
	]
	const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

	if (user) {
		navLinks.splice(1, 0, { label: "Books", path: "/books" })
	}

	return (
		<div>
			<header className="fixed top-0 left-0 h-16 w-full items-center px-5 grid grid-cols-3 z-2 bg-background">
				<div className="flex items-center gap-6">
					<LogoIcon size={20} />
					<div className="flex gap-1">
						{navLinks.map(item => {
							const isActive = url === item.path

							return (
								<Button key={item.path} variant={isActive ? "secondary" : "ghost"} className={cn("text-sm rounded-full", !isActive && "text-subtle")} nativeButton={false} render={<Link href={item.path} prefetch />}>{item.label}</Button>
							)
						})}
					</div>
				</div>
				<div className="flex-center">
					<div className="w-full max-w-sm">
						<button
							className="bg-black/5 w-3/4 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 transition focus-visible:ring-3 focus-visible:ring-ring/50 w-full h-10 flex items-center gap-3 px-4 rounded-full text-sm text-subtle"
							onClick={() => setIsSearchOpen(true)}
						>
							<SearchIcon size={20} />
							<span>Search for books / authors / genres</span>
						</button>
					</div>
				</div>
				{!!user && (
					<div className="flex items-center gap-2 justify-end">
						<NotificationsPopover />
						<TopProfileMenu user={user} />
					</div>
				)}
				{!user && (
					<div className="flex gap-1 justify-end">
						<Button nativeButton={false} render={<Link href={"/login"} />} className={"text-sm rounded-full"}>Log in</Button>
						<Button nativeButton={false} render={<Link href={"/signup"} />} variant={"outline"} className={"text-sm rounded-full"}>Join for free</Button>
					</div>
				)}
			</header>
			<div className="h-16"></div>
			<SearchDialog isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
		</div>
	)
}