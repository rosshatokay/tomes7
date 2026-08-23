import { useHotkeys } from "react-hotkeys-hook"
import { PaginationMeta } from "@/interfaces/pagination";
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Kbd, KbdGroup } from "../ui/kbd";
import { useOperatingSystem } from "@/lib/utils";

export function TablePagination({ meta }: { meta: PaginationMeta }) {
	const { current_page, total_pages, prev_page, next_page, total_count } = meta
	const { url } = usePage()
	const os = useOperatingSystem()

	const getPageUrl = (pageNumber: number | null) => {
		if (!pageNumber) return ''

		const searchParams = new URLSearchParams(window.location.search)

		searchParams.set('page', pageNumber.toString())

		return `${window.location.pathname}?${searchParams.toString()}`
	}

	const prevBtn = <Button size={"icon"} variant={"ghost"} nativeButton={!prev_page} disabled={!prev_page} render={prev_page ? <Link href={getPageUrl(prev_page)} /> : undefined}>
		<ChevronLeftIcon />
	</Button>
	const nextBtn = <Button size={"icon"} variant={"ghost"} nativeButton={!next_page} disabled={!next_page} render={next_page ? <Link href={getPageUrl(next_page)} /> : undefined}>
		<ChevronRightIcon />
	</Button>

	useHotkeys('mod+shift+left', () => prev_page ? router.visit(getPageUrl(prev_page)) : undefined)
	useHotkeys('mod+shift+right', () => next_page ? router.visit(getPageUrl(next_page)) : undefined)

	return (
		<div className="h-12 min-h-12 w-full flex items-center border-t px-4 gap-4">
			<div className="text-sm text-subtle">Page {current_page} of {total_pages} - {total_count} total items</div>
			<div className="flex gap-1">
				{/* <Button variant={"ghost"} nativeButton={prev_page ? false : true} render={prev_page ? <Link href={prev_page} /> : undefined}><ChevronLeftIcon /> Previous</Button> */}
				<Tooltip>
					<TooltipTrigger delay={0} render={prevBtn} />
					<TooltipContent>
						Previous page
						<KbdGroup>
							<Kbd>{os === "macOS" && "⌘"}{os === "Windows" && "ctrl"}</Kbd>
							<Kbd>⇧</Kbd>
							<Kbd>{"←"}</Kbd>
						</KbdGroup>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger delay={0} render={nextBtn} />
					<TooltipContent>
						Next page
						<KbdGroup>
							<Kbd>{os === "macOS" && "⌘"}{os === "Windows" && "ctrl"}</Kbd>
							<Kbd>⇧</Kbd>
							<Kbd>{"→"}</Kbd>
						</KbdGroup>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	)
}