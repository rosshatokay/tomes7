import { Logo } from "@/assets/Logo"
import { LogoIcon } from "@/assets/LogoIcon"
import AppHeader from "@/components/partials/AppHeader"
import { Footer } from "@/components/partials/Footer"
import { Button } from "@/components/ui/button"
import { toast, Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProps } from "@/interfaces/auth"
import { PageProps } from "@inertiajs/core"
import { usePage } from "@inertiajs/react"
import { PropsWithChildren, useEffect } from "react"

interface BaseLayoutProps {
	children: PropsWithChildren['children'],
	hideHeader?: boolean
	hideFooter?: boolean
	auth?: AuthProps
}

interface FlashProps {
	toast?: {
		title?: string
		description?: string
		variant?: 'default' | 'destructive'
	}
}

export default function BaseLayout({ children, hideHeader, hideFooter, auth }: BaseLayoutProps) {
	const flash = usePage().flash as FlashProps
	const currComponent = usePage().component
	const shouldHideFooter = ["Feeds/"].some(prefix => currComponent.startsWith(prefix))


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
			{!hideFooter || shouldHideFooter && <Footer />}
			<Toaster></Toaster>
			<TooltipProvider delay={0}></TooltipProvider>
		</div>
	)
}