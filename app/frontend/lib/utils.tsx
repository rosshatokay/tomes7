import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link } from "@inertiajs/react"
import clsx, { type ClassValue } from "clsx"
import React from "react"
import { twMerge } from "tailwind-merge"

export interface Breadcrumb {
	icon?: React.ReactNode
	label?: string
	path: string
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function createBreadcrumbs(breadcrumbs: Breadcrumb[]) {
	return (
		<div className="breadcrumb-wrapper">
			<Breadcrumb>
				<BreadcrumbList>
					{
						breadcrumbs.map((item, i) => {
							const finalLabel = item.label || (<div className="size-5 flex-center"><div className="breadcrumb-icon size-4 flex-center">{item.icon}</div></div>)
							return (
								<React.Fragment key={i}>
									<BreadcrumbItem>
										{
											(i < breadcrumbs.length - 1) 
											? <BreadcrumbLink render={<Link href={item.path}></Link>}>{finalLabel}</BreadcrumbLink>
											: <BreadcrumbPage>{item.label}</BreadcrumbPage>
										}
									</BreadcrumbItem>
									{i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
								</React.Fragment>

							)
						})
					}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	)
}