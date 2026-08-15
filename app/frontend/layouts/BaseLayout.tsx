import { Logo } from "@/assets/Logo"
import { LogoIcon } from "@/assets/LogoIcon"
import AppHeader from "@/components/partials/AppHeader"
import { Footer } from "@/components/partials/Footer"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PropsWithChildren } from "react"

interface BaseLayoutProps {
	children: PropsWithChildren['children'],
	hideHeader?: boolean
	hideFooter?: boolean
}

interface FlashProps {
	toast?: {
		title?: string
		description?: string
		variant?: 'default' | 'destructive'
	}
}

export default function BaseLayout({ children, hideHeader, hideFooter }: BaseLayoutProps) {
	return (
		<div>
			{!hideHeader && <AppHeader />}
			<main id="main" className="transition">
				{children}
			</main>
			{!hideFooter && <Footer />}
			<Toaster></Toaster>
			<TooltipProvider delay={0}></TooltipProvider>
		</div>
	)
}