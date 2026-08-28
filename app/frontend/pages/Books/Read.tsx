import { Rendition, Location } from 'epubjs';
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Book } from "@/interfaces/book"
import ReaderLayout from "@/layouts/ReaderLayout"
import { useHttp } from "@inertiajs/react"
import { ALargeSmallIcon, ArrowLeftIcon, BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon, MenuIcon, MoreHorizontalIcon, SearchIcon, ShareIcon } from "lucide-react"
import { Fragment, useEffect, useRef, useState } from "react"
import { EpubViewer, ReactEpubViewer, ViewerRef } from "react-epub-viewer"
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { goBack } from '@/lib/utils';
import ChaptersSheet from '@/components/partials/dialogs/ChaptersSheet';
import Navigation, { NavItem } from 'epubjs/types/navigation';
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown-menu';

interface WithEpub extends Book {
	epub_file_path: string
}

interface Props {
	book: WithEpub
}

export default function ReadBookPage({ book }: Props) {
	const [isReady, setIsReady] = useState(false)
	const viewerRef = useRef<ViewerRef>(null)
	const [toc, setToc] = useState<Navigation['toc']>()
	const [rendition, setRendition] = useState<Rendition>()
	const [currChapter, setCurrChapter] = useState<NavItem | null>(null)
	const [isChaptersOpen, setIsChaptersOpen] = useState(false)

	const rightSideButtons = [
		{
			icon: <ShareIcon />,
			label: "Share"
		},
		{
			icon: <ALargeSmallIcon />,
			label: "Display"
		},
		{
			icon: <ListIcon />,
			label: "Table of contents",
			onClick: () => setIsChaptersOpen(true)
		}
	]

	useEffect(() => {
		setIsReady(true)
	}, [])

	useEffect(() => {
		rendition?.on('relocated', (loc: Location) => {
			const href = loc.start.href
			const match = toc?.find((item: any) => href.includes(item.href.split('#')[0]))

			setCurrChapter(match as any)
		})

	}, [rendition])

	return (
		<div className="h-screen w-full flex flex-col bg-black/1 p-2 pt-0">
			<div className="h-12 min-h-12 flex grid grid-cols-[1fr_2fr_1fr] items-center justify-between px-3 text-sm">
				<Tooltip>
					<TooltipTrigger delay={0} render={<Button variant={"ghost"} size={"icon"} onClick={goBack}><ArrowLeftIcon /></Button>} />
					<TooltipContent>Exit reader</TooltipContent>
				</Tooltip>
				<div className="flex items-center gap-3 justify-center">
					<div className="font-medium truncate">
						{book.title}
						{currChapter && <span className="font-normal text-subtle"> • {currChapter.label.trim()}</span>}
					</div>
				</div>
				<div className="flex gap-1 justify-end">
					{rightSideButtons.map((b, index) => (
						<Tooltip key={index}>
							<TooltipTrigger
								delay={0}
								render={<Button
									variant={"ghost"}
									size={"icon"}
									onClick={() => b.onClick ? b.onClick() : undefined}
								>{b.icon}</Button>} />
							<TooltipContent>{b.label}</TooltipContent>
						</Tooltip>
					))}
					<DropdownMenu>
						<DropdownMenuContent></DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="bg-white dark:bg-card border rounded-lg h-full overflow-hidden">
				{isReady ? (
					<div className="flex flex-col h-full py-12">
						<EpubViewer
							epubOptions={{ allowScriptedContent: true }}
							url={book.epub_file_path}
							ref={viewerRef}
							rendtionChanged={(r) => setRendition(r)}
							epubFileOptions={{ openAs: "epub" }}
							bookChanged={(book) => {
								book.loaded.navigation.then((toc) => {
									setToc(toc.toc)
								})
							}}
						/>
					</div>
				) : (<div className="flex-center h-full"><Spinner className="size-6" /></div>)}
			</div>
			<ChaptersSheet
				isOpen={isChaptersOpen}
				setIsOpen={setIsChaptersOpen}
				toc={toc}
				currentChapter={currChapter}
				rendition={rendition}
			/>
		</div>
	)
}

ReadBookPage.layout = (page: React.ReactNode) => <ReaderLayout>{page}</ReaderLayout>