import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Fragment, RefObject, useEffect, useState } from "react";
import Navigation, { NavItem } from 'epubjs/types/navigation';
import { cn } from "@/lib/utils";
import { Rendition } from "epubjs";

interface ProcessedTocItem extends NavItem {
	anchor: string;
}

interface FileGroupedToc {
	[filename: string]: ProcessedTocItem[];
}

interface Props {
	isOpen: boolean
	setIsOpen: (state: boolean) => void
	toc: Navigation['toc'] | undefined
	currentChapter: NavItem | null,
	rendition: Rendition | undefined
}

// doesn't work across the board
function groupTocHier(tocArr: NavItem[]): FileGroupedToc {
	const fileGroup: any = {}
	tocArr.forEach(item => {
		const [filename, anchor] = item.href.split("#")
		if (!fileGroup[filename]) fileGroup[filename] = []
		fileGroup[filename].push({ ...item, anchor: anchor || '' })
	})
	return fileGroup
}

export default function ChaptersSheet({ isOpen, setIsOpen, toc, currentChapter, rendition }: Props) {
	const [hoveredChapterIndex, setHoveredChapterIndex] = useState<number | null>(null)
	const [activeIndex, setActiveIndex] = useState<number | null>()

	const handleTocClick = async (href: string) => {
		rendition?.display(href)
		setIsOpen(false)
	}

	// const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
	// 	if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault()

	// 	if (hoveredChapterIndex) {
	// 		if (e.key === "ArrowUp") hoveredChapterIndex > 1 && setHoveredChapterIndex(hoveredChapterIndex - 1)
	// 		if (e.key === "ArrowDown") hoveredChapterIndex > 1 && setHoveredChapterIndex(hoveredChapterIndex + 1)
	// 	}

	// 	console.log(hoveredChapterIndex)
	// }

	useEffect(() => {
		if (!toc || !currentChapter) return
		setActiveIndex(toc?.findIndex(n => n.id === currentChapter?.id) || 0)
	}, [toc, currentChapter])

	return (
		<Sheet open={isOpen} onOpenChange={open => !open && setIsOpen(false)}>
			<SheetContent className={"gap-0"}>
				<SheetHeader>
					<SheetTitle>Table of contents</SheetTitle>
				</SheetHeader>
				<div className="overflow-y-auto">
					<div className="flex flex-col gap-0.5 px-2 pb-4">
						{toc?.map((item, index) => {
							const isActive = item.id === currentChapter?.id
							// const isHovered = hoveredChapterIndex ? index === (hoveredChapterIndex) - 1 : null

							return (
								<Fragment key={index}>
									<button
										onClick={() => handleTocClick(item.href)}
										onMouseEnter={() => setHoveredChapterIndex(index)}
										onMouseLeave={() => {
											setHoveredChapterIndex(activeIndex ? activeIndex + 1 : 0 || null)
										}}
										className={
											cn("flex cursor-pointer items-center gap-2 p-2  rounded-md transition hover:bg-black/5 active:bg-black/5 dark:hover:bg-white/10 dark:active:bg-white/15",
												(isActive) ? "bg-black/5 dark:bg-white/10" : "")
										}
									>
										<div className="bg-white/10 w-5 min-w-5 flex-center px-2 text-[11px] text-subtle rounded-sm">{++index}</div>
										<div className="truncate">{item.label}</div>
									</button>
									{/* <hr /> */}
								</Fragment>
							)
						})}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}