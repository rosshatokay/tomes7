import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, useEffect } from "react";
import { LogoIcon } from "../assets/LogoIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ActivityIcon, FeatherIcon, HomeIcon, HouseIcon, InboxIcon, LibraryBigIcon, PlusIcon, UsersIcon } from "lucide-react";
import TopProfileMenu from "@/components/partials/TopProfileMenu";
import { AuthProps } from "@/interfaces/auth";
import { toast, Toaster } from "@/components/ui/toast";
import { FlashProps } from "./BaseLayout";
import { AdminHeaderProvider, useAdminHeader } from "@/components/contexts/AdminHeaderContext";

const links = [

	{
		path: '/admins',
		label: "Home",
		icon: (size = 20) => <HouseIcon size={size} />
	},
	{
		path: '/admins/books',
		label: "Books",
		icon: (size = 20) => <LibraryBigIcon size={size} />
	},
	{
		path: '/admins/authors',
		label: "Authors",
		icon: (size = 20) => <FeatherIcon size={size} />
	},
	{
		path: '/admins/inbox',
		label: "Inbox",
		icon: (size = 20) => <InboxIcon size={size} />
	},
	{
		path: '/admins/users',
		label: "Users",
		icon: (size = 20) => <UsersIcon size={size} />
	},
	{
		path: '/admins/activities',
		label: "Activities",
		icon: (size = 20) => <ActivityIcon size={size} />
	}
]

function AdminLayoutContent({ children }: PropsWithChildren) {
	const flash = usePage().flash as FlashProps
	const { url } = usePage()
	const auth = usePage().props.auth as AuthProps
	const activeTab = links.filter(l => l.path === url.split("?")[0])[0]
	const { headerContent } = useAdminHeader()

	useEffect(() => {
		if (flash?.toast) {
			toast.add({
				timeout: 3000,
				description: flash.toast.description,
			})
		}
	})

	return (
		<div className="grid md:grid-cols-[64px_1fr] grid-cols-1 w-full h-screen overflow-hidden">
			<aside className="min-w-[64px] w-[64px] h-screen overflow-y-auto hidden md:flex flex-col gap-10 py-4 justify-between items-center">
				<div className="flex flex-col items-center h-full">
					<div className="mb-6">
						<LogoIcon size={18} />
					</div>
					<div className="flex flex-col h-full items-center">
						<div className="flex flex-col">
							{links.map(l => {
								const isActive = url.split('?')[0] === l.path

								return (
									<Tooltip key={l.path} >
										<TooltipTrigger delay={0} render={
											<Button
												nativeButton={false}
												size={"icon-lg"}
												variant={isActive ? "secondary" : "ghost"}
												render={
													<Link href={l.path} />}>{l.icon(24)}</Button>
										}
										/>
										<TooltipContent side="right">{l.label}</TooltipContent>
									</Tooltip>
								)
							})}
						</div>
						<div className="mt-auto">
							<TopProfileMenu user={auth.user} />
						</div>
					</div>
				</div>
			</aside>
			<main className="w-full h-full overflow-hidden p-2 pt-1 flex flex-col">
				<div className="flex items-center h-13 justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-card size-7 rounded-md flex-center">
							{activeTab?.icon(16)}
						</div>
						<div className="text-sm">{activeTab?.label}</div>
					</div>
					{headerContent}
				</div>
				<div className="w-full h-full overflow-y-auto bg-white/70 dark:bg-white/4 rounded-lg border">
					{children}
				</div>
			</main>
			<Toaster />
			<TooltipProvider />
		</div>
	)
}

export default function AdminLayout({children}: PropsWithChildren) {
	return (
		<AdminHeaderProvider>
			<AdminLayoutContent>{children}</AdminLayoutContent>
		</AdminHeaderProvider>
	)
}