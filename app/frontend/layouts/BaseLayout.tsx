import { LogoIcon } from "@/assets/LogoIcon"
import AppHeader from "@/components/partials/AppHeader"
import NotificationsSheet from "@/components/partials/dialogs/NotificationsSheet"
import { Footer } from "@/components/partials/Footer"
import NotificationsPopover from "@/components/partials/NotificationsPopover"
import { Button } from "@/components/ui/button"
import { toast, Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProps } from "@/interfaces/auth"
import { cn, useIsMobile } from "@/lib/utils"
import { Link, usePage } from "@inertiajs/react"
import { BellIcon, CompassIcon, HomeIcon } from "lucide-react"
import { createContext, Fragment, PropsWithChildren, useContext, useEffect, useState } from "react"

interface BaseLayoutProps {
	children: PropsWithChildren['children'],
	hideHeader?: boolean
	hideFooter?: boolean
	auth?: AuthProps
	hideMobileNav?: boolean
	hideHeaderForced?: boolean
	forceFooterForMobile?: boolean
}

export interface FlashProps {
	toast?: {
		title?: string
		description?: string
		variant?: 'default' | 'destructive'
	}
}

const ReadyContext = createContext<boolean>(false)
export const useReady = () => useContext(ReadyContext)

export default function BaseLayout({ children, hideHeader, hideHeaderForced, hideFooter, hideMobileNav, forceFooterForMobile = false }: BaseLayoutProps) {
	const flash = usePage().flash as FlashProps
	const isMobile = useIsMobile()
	const [isReady, setIsReady] = useState(false)
	const [isNotifsOpen, setIsNotifsOpen] = useState(false)
	const shouldHideFooter = false
	const auth = usePage().props.auth as AuthProps

	const mobileNavLinks = [
		{
			icon: (active: boolean) => <HomeIcon className={cn("!size-6", active ? "text-on-secondary dark:text-background" : "text-white/75")} />,
			path: "/"
		},
		{
			icon: (active: boolean) => <CompassIcon className={cn("!size-6", active ? "text-on-secondary dark:text-background" : "text-white/75")} />,
			path: "/explore"
		},
		{
			icon: (active: boolean) => <BellIcon className={cn("!size-6", active ? "text-on-secondary dark:text-background" : "text-white/75")} />,
			onClick: () => setIsNotifsOpen(true)
		},
	]

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
		}, 400);
	}, [])

	hideHeader = hideHeaderForced ? hideHeaderForced : (hideHeader && isMobile)

	return (
		<ReadyContext.Provider value={isReady}>
			{!isReady && (
				<div className="w-full h-screen flex-center z-[99999999999] fixed bg-background">
					<div className="animate-pulse">
						<LogoIcon size={32} />
					</div>
				</div>
			)}
			<div>
				{!hideHeader && <AppHeader user={auth?.user} />}
				<main id="main" className={cn("transition")}>
					{children}
				</main>
				{auth.user && isMobile && !hideMobileNav && (
					<Fragment>
						<div className="fixed left-0 right-0 bottom-0 top-auto z-3">
							<div className="w-full h-full flex-center">
								<div className="from-background absolute inset-0 w-full bg-gradient-to-t to-transparent"></div>
								<div className="mb-8 h-15 w-48 min-w-48 max-w-48 rounded-full bg-foreground/50 backdrop-blur-md flex items-center justify-evenly">
									{mobileNavLinks.map((item, index) => {
										const isActive = item.path === usePage().url.split("?")[0]

										return (
											<Button
												size={"icon-lg"}
												variant={isActive ? "secondary" : "ghost"}
												className={cn("rounded-full", isActive && "bg-white")}
												key={index}
												nativeButton={item.onClick ? true : false}
												render={item.onClick ? <button onClick={() => item.onClick()} /> : <Link href={item.path} />}
											>
												{item.icon(isActive)}
											</Button>
										)
									})}
								</div>
							</div>
						</div>
						<div className="h-25"></div>
					</Fragment>
				)}
				{!isMobile && !hideFooter && !shouldHideFooter && <Footer />}
				{forceFooterForMobile && isMobile && <Footer />}
				{isMobile && <NotificationsSheet isOpen={isNotifsOpen} setIsOpen={setIsNotifsOpen} />}
				<Toaster></Toaster>
				<TooltipProvider delay={0}></TooltipProvider>
			</div>
		</ReadyContext.Provider>
	)
}