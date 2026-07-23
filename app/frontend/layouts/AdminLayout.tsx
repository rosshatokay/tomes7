import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { LogoIcon } from "../assets/LogoIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const links = [

	{
		path: '/admins',
		label: "Home",
		icon: "ph-house",
	},
	{
		path: '/admins/books',
		label: "Books",
		icon: "ph-books",
	},
	{
		path: '/admins_authors_path',
		label: "Authors",
		icon: "ph-address-book",
	},
	{
		path: '/admins_feedbacks_path',
		label: "Inbox",
		icon: "ph-chat",
	},
	{
		path: '/admins_users_path',
		label: "Users",
		icon: "ph-users-four",
	},
	{
		path: '/admins_activities_path',
		label: "Activities",
		icon: "ph-pulse",
	}
]

export default function AdminLayout({ children }: PropsWithChildren) {
	const { url } = usePage()

	return (
		<div className="grid md:grid-cols-[64px_1fr] grid-cols-1 w-full h-screen overflow-hidden">
			<aside className="min-w-[64px] w-[64px] h-screen overflow-y-auto hidden md:flex flex-col gap-10 py-4 justify-between items-center">
				<div className="flex flex-col items-center">
					<div className="mb-6">
						<LogoIcon size={20} />
					</div>
					<div className="flex flex-col">
						{links.map(l => (
							<Tooltip key={l.path} >
								<TooltipTrigger delay={0} render={<Link href={l.path} className="btn btn-icon btn-clear w-8 mb-2"><i className={`ph ${l.icon}`}></i></Link>} />
								<TooltipContent side="right">{l.label}</TooltipContent>
							</Tooltip>
						))}
					</div>
				</div>
			</aside>
			<main className="w-full h-full overflow-y-auto md:px-0 px-5">
				<div className="pt-12"></div>
				{children}
				<div className="pb-16"></div>
			</main>
			<TooltipProvider delay={0}></TooltipProvider>
		</div>
	)
}