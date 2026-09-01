import { Rendition, Location } from 'epubjs';
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Book } from "@/interfaces/book"
import ReaderLayout from "@/layouts/ReaderLayout"
import { ALargeSmallIcon, ArrowLeftIcon, ListIcon, ShareIcon, } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { EpubViewer, ViewerRef } from "react-epub-viewer"
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { goBack } from '@/lib/utils';
import ChaptersSheet from '@/components/partials/dialogs/ChaptersSheet';
import Navigation, { NavItem } from 'epubjs/types/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import ShareDialog from '@/components/partials/ShareDialog';
import { addCustomFont, addStyleToReader } from './partials/utils';

const epubLightTheme = {
	body: {
		"font-family": "Crimson Text !important",
		"line-height": "1.35",
		"background": "transparent"
	},
	"a:link": {
		"color": "black",
		"border-bottom": "1px solid rgba(1,1,1,.1)",
	},
	"a:link:hover": {
		"border-color": "black"
	}
}

const epubDarkTheme = {
	body: {
		"font-family": "Crimson Text !important",
		"line-height": "1.35",
		"background": "transparent"
	},
	"a:link": {
		"color": "white",
		"border-bottom": "1px solid rgba(255,255,255,.2)",
	},
	"a:link:hover": {
		"border-color": "white"
	}
}

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
	const [isShareOpen, setIsShareOpen] = useState(false)

	const rightSideButtons = [
		{
			icon: <ShareIcon />,
			label: "Share",
			onClick: () => setIsShareOpen(true)
		},
		// {
		// 	icon: <ALargeSmallIcon />,
		// 	label: "Display",
		// 	onClick: () => rendition?.themes.fontSize("125%")
		// },
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
		const handleRelocated = (loc: Location) => {
			const href = loc.start.href
			const match = toc?.find((item: any) => href.includes(item.href.split('#')[0]))
			setCurrChapter(match as any)
		}

		const contentHook = (contents: any) => {
			addStyleToReader(contents)
			addCustomFont(contents)
		}

		rendition?.on('relocated', handleRelocated)
		rendition?.hooks.content.register(contentHook)

		rendition?.themes.register("light", epubLightTheme)
		rendition?.themes.register("dark", epubDarkTheme)
		rendition?.themes.fontSize("125%")

		if (window.Theme.getTheme() === "system") {
			rendition?.themes.select(window.Theme.prefersDark() ? "dark" : "light")
		} else {
			rendition?.themes.select(window.Theme.getTheme())
		}

		return () => {
			rendition?.hooks.content.deregister(contentHook)
			rendition?.off('relocated', handleRelocated)
		}
	}, [rendition])

	return (
		<div className="h-screen bg-background w-full flex flex-col md:bg-black/1 p-2 pt-0">
			<div className="h-12 min-h-12 flex grid grid-cols-[1fr_2fr_1fr] items-center justify-between px-3 text-sm">
				<Tooltip>
					<TooltipTrigger delay={0} render={<Button variant={"ghost"} size={"icon"} onClick={goBack}><ArrowLeftIcon /></Button>} />
					<TooltipContent>Exit reader</TooltipContent>
				</Tooltip>
				<div className="flex items-center gap-3 justify-center min-w-0">
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
				</div>
			</div>
			<div className="bg-background md:border rounded-lg h-full overflow-hidden">
				{isReady ? (
					<div className="flex flex-col h-full md:py-12">
						<EpubViewer
							epubOptions={{ allowScriptedContent: true }}
							url={book.epub_file_path}
							ref={viewerRef}
							rendtionChanged={(r) => {
								setRendition(r)
							}}
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
			<ShareDialog url={book.share_url} title="Share book" isOpen={isShareOpen} setIsOpen={setIsShareOpen} />
		</div>
	)
}

ReadBookPage.layout = (page: React.ReactNode) => <ReaderLayout>{page}</ReaderLayout>


{/* <DropdownMenu>
						<DropdownMenuTrigger render={<Button size={"icon"} variant={"ghost"} />}><MoreHorizontalIcon /></DropdownMenuTrigger>
						<DropdownMenuContent className={"w-54"}>
							<DropdownMenuGroup>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem>
									<SearchIcon />
									Search
									<DropdownMenuShortcut>S</DropdownMenuShortcut>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<CornerUpRightIcon />
									Go to page
									<DropdownMenuShortcut>G</DropdownMenuShortcut>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<StarPlusIcon />
									Add review
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuLabel>Display</DropdownMenuLabel>
								<DropdownMenuItem closeOnClick={false}>
									<AArrowUpIcon />
									Large text
									<Switch className={"ml-auto"} />
								</DropdownMenuItem>
								<DropdownMenuItem>
									<FullscreenIcon />
									Fullscreen
									<Switch className={"ml-auto"} />
								</DropdownMenuItem>
								<DropdownMenuItem>
									<SlidersHorizontalIcon />
									Customize display
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<SquareArrowRightExitIcon />
									Exit to home
									<DropdownMenuShortcut>F</DropdownMenuShortcut>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup className={"p-2 text-xs text-subtle flex flex-col gap-1"}>
								<div className="">840 words</div>
								<div className="">16 hour read time</div>
								<div className="">Read 85%</div>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu> */}