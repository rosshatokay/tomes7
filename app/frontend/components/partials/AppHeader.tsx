import { LogoIcon } from "@/assets/LogoIcon";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";

export default function AppHeader() {
	const { url } = usePage()
	const navLinks = [
		{ label: "Books", path: "/" },
		{ label: "Authors", path: "/authors" }
	] 

	return (
		<div>
			<header className="fixed top-0 left-0 h-16 w-full items-center px-5 grid grid-cols-3 z-2 bg-background">
				<div className="flex items-center gap-6">
					<LogoIcon size={20} />
					<div className="flex gap-1">
						{navLinks.map(item => {
							const isActive = url === item.path
							
							return (
								<Button key={item.path} variant={isActive ? "secondary" : "ghost"} className={cn("text-[15px] rounded-full", !isActive && "text-subtle")} nativeButton={false} render={<Link href={"/"} />}>{item.label}</Button>
							)
						})}
					</div>
				</div>
				<div className="flex-center">
					<div className="w-full max-w-sm">
						<button className="bg-card w-full h-10 flex items-center gap-3 px-4 rounded-full text-[15px] text-subtle">
							<SearchIcon size={20} />
							<span>Search for books / authors / genres</span>
						</button>
					</div>
				</div>
				<div className="flex gap-1 justify-end">
					<Button nativeButton={false} render={<Link href={"/login"} />} className={"text-[15px] rounded-full"}>Log in</Button>
					<Button nativeButton={false} render={<Link href={"/register"} />} variant={"outline"} className={"text-[15px] rounded-full"}>Join for free</Button>
				</div>
			</header>
			<div className="h-16"></div>
		</div>
	)
}