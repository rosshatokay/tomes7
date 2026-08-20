import AppHeader from "@/components/partials/AppHeader"
import { Footer } from "@/components/partials/Footer"
import { Button } from "@/components/ui/button"
import { toast, Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProps } from "@/interfaces/auth"
import { useIsMobile } from "@/lib/utils"
import { usePage } from "@inertiajs/react"
import { HeartIcon, HomeIcon, PlusIcon, SearchIcon } from "lucide-react"
import { PropsWithChildren, useEffect } from "react"

interface BaseLayoutProps {
	children: PropsWithChildren['children'],
	hideHeader?: boolean
	hideFooter?: boolean
	auth?: AuthProps
}

export interface FlashProps {
	toast?: {
		title?: string
		description?: string
		variant?: 'default' | 'destructive'
	}
}

export default function BaseLayout({ children, hideHeader, hideFooter, auth }: BaseLayoutProps) {
	const flash = usePage().flash as FlashProps
	const isMobile = useIsMobile()
	const currComponent = usePage().component
	// const shouldHideFooter = ["Feeds/"].some(prefix => currComponent.startsWith(prefix))
	const shouldHideFooter = false

	useEffect(() => {
		if (flash?.toast) {
			toast.add({
				timeout: 3000,
				description: flash.toast.description,
			})
		}
	})

	return (
		<div>
			{!hideHeader && <AppHeader user={auth?.user} />}
			<main id="main" className="transition">
				{children}
			</main>
			{isMobile && (
				<div className="fixed left-0 right-0 bottom-0 top-auto z-3">
					<div className="w-full h-full flex-center">
						<div className="from-background absolute inset-0 w-full bg-gradient-to-t to-transparent"></div>
						<div className="mb-8 h-15 w-[256px] min-w-[256px] max-w-[256px] rounded-full bg-foreground/20 backdrop-blur-md flex items-center justify-evenly">
							<Button size={"icon-lg"} variant={"ghost"}><HomeIcon className="!size-6" /></Button>
							<Button size={"icon-lg"} variant={"ghost"}><SearchIcon className="!size-6" /></Button>
							<Button size={"icon-lg"} variant={"ghost"}><PlusIcon className="!size-6" /></Button>
							<Button size={"icon-lg"} variant={"ghost"}><HeartIcon className="!size-6" /></Button>
							<Button size={"icon-lg"} variant={"ghost"}><HomeIcon className="!size-6" /></Button>
						</div>
					</div>
				</div>
			)}
			{!hideFooter && !shouldHideFooter && <Footer />}
			<Toaster></Toaster>
			<TooltipProvider delay={0}></TooltipProvider>
		</div>
	)
}