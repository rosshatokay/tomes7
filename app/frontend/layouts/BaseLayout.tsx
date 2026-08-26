import { LogoIcon } from "@/assets/LogoIcon"
import AppHeader from "@/components/partials/AppHeader"
import { Footer } from "@/components/partials/Footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast, Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProps } from "@/interfaces/auth"
import { useIsMobile } from "@/lib/utils"
import { usePage } from "@inertiajs/react"
import { BellIcon, CompassIcon, HeartIcon, HomeIcon, PlusIcon, SearchIcon } from "lucide-react"
import { PropsWithChildren, useEffect, useState } from "react"

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
	const [isReady, setIsReady] = useState(false)
	const shouldHideFooter = false

	useEffect(() => {
		if (flash?.toast) {
			toast.add({
				timeout: 3000,
				description: flash.toast.description,
			})
		}
	})

	useEffect(() => {
		setTimeout(() => {
			setIsReady(true)
		}, 600);
	}, [])

	return (
		<div>
			{!isReady && (
				<div className="w-full h-screen flex-center">
					<div className="animate-pulse">
						<LogoIcon size={32} />
					</div>
				</div>
			)}
			{isReady && (
				<div>
					{!hideHeader && <AppHeader user={auth?.user} />}
					<main id="main" className="transition">
						{children}
					</main>
					{isMobile && (
						<div className="fixed left-0 right-0 bottom-0 top-auto z-3">
							<div className="w-full h-full flex-center">
								<div className="from-background absolute inset-0 w-full bg-gradient-to-t to-transparent"></div>
								<div className="mb-8 h-15 w-48 min-w-48 max-w-48 rounded-full bg-foreground/50 backdrop-blur-md flex items-center justify-evenly">
									<Button size={"icon-lg"} variant={"ghost"}><HomeIcon className="!size-6 dark:text-foreground text-white" /></Button>
									<Button size={"icon-lg"} variant={"ghost"}><CompassIcon className="!size-6 dark:text-foreground text-white" /></Button>
									<Button size={"icon-lg"} variant={"ghost"}><BellIcon className="!size-6 dark:text-foreground text-white" /></Button>
									{/* <Button size={"icon-lg"} variant={"ghost"}><HeartIcon className="!size-6 dark:text-foreground text-white" /></Button>
									<Button size={"icon-lg"} variant={"ghost"}><HomeIcon className="!size-6 dark:text-foreground text-white" /></Button> */}
								</div>
							</div>
						</div>
					)}
					{!hideFooter && !shouldHideFooter && <Footer />}
					<Toaster></Toaster>
					<TooltipProvider delay={0}></TooltipProvider>
				</div>
			)}
		</div>
	)
}