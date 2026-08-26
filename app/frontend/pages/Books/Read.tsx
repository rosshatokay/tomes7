import { Rendition, Location } from 'epubjs';
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Book } from "@/interfaces/book"
import ReaderLayout from "@/layouts/ReaderLayout"
import { useHttp } from "@inertiajs/react"
import { ALargeSmallIcon, BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon, MenuIcon, MoreHorizontalIcon, SearchIcon, ShareIcon } from "lucide-react"
import { Fragment, useEffect, useRef, useState } from "react"
import { EpubViewer, ReactEpubViewer, ViewerRef } from "react-epub-viewer"
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface WithEpub extends Book {
	epub_file_path: string
}

interface Props {
	book: WithEpub
}

const rightSideButtons = [
	{
		icon: <ShareIcon />,
		label: "Share"
	},
	{
		icon: <ALargeSmallIcon />,
		label: "Display"
	},
	// {
	// 	icon: <SearchIcon />,
	// 	label: "Search"
	// },
	{
		icon: <MoreHorizontalIcon />,
	}
]

export default function ReadBookPage({ book }: Props) {
	const [isReady, setIsReady] = useState(false)
	const viewerRef = useRef<ViewerRef>(null)
	const [toc, setToc] = useState([])
	const [rendition, setRendition] = useState<Rendition>()
	const [chapter, setChapter] = useState<{ label: string, href: string } | null>(null)

	useEffect(() => {
		setIsReady(true)
	}, [])

	useEffect(() => {
		rendition?.on('relocated', (loc: Location) => {
			const href = loc.start.href
			const match = toc.find((item: any) => href.includes(item.href.split('#')[0]))

			setChapter(match as any)
		})
	}, [rendition])

	return (
		<div className="h-screen w-full flex flex-col bg-black/1 p-2 pt-0">
			<div className="h-12 min-h-12 flex grid grid-cols-3 items-center justify-between px-3 text-sm">
				<div className='flex gap-1'>
					<Button variant={"ghost"} size={"icon"}><ListIcon /></Button>
					<Button variant={"ghost"} size={"icon"}><BookmarkIcon /></Button>
				</div>
				<div className="flex items-center gap-3 justify-center">
					<div className="font-medium truncate">
						{book.title}
						{chapter && <span className="font-normal text-subtle"> • {chapter.label}</span>}
					</div>
				</div>
				<div className="flex gap-1 justify-end">
					{rightSideButtons.map((b, index) => (
						<Tooltip key={index}>
							<TooltipTrigger delay={0} render={<Button variant={"ghost"} size={"icon"}>{b.icon}</Button>} />
							{b.label && <TooltipContent>{b.label}</TooltipContent>}
						</Tooltip>
					))}
					{/* <Button variant={"ghost"} size={"icon"}><ShareIcon /></Button>
					<Button variant={"ghost"} size={"icon"}><ALargeSmallIcon /></Button>
					<Button variant={"ghost"} size={"icon"}><SearchIcon /></Button>
					<Button variant={"ghost"} size={"icon"}><MoreHorizontalIcon /></Button> */}
				</div>
			</div>
			<div className="bg-card border rounded-lg h-full overflow-hidden">
				<div className="h-6"></div>
				{isReady ? (
					<div className="h-full">
						<EpubViewer
							epubOptions={{ allowScriptedContent: true }}
							url={book.epub_file_path}
							ref={viewerRef}
							rendtionChanged={(r) => setRendition(r)}
							epubFileOptions={{ openAs: "epub" }}
							tocChanged={(tocData) => setToc(tocData as [])}
						/>
						<div className="h-6"></div>
					</div>
				) : (
					<div className="flex-center h-full"><Spinner className="size-6" /></div>
				)}
			</div>
			{/* <div className="h-10 min-h-10"></div> */}
		</div>
	)
}

ReadBookPage.layout = (page: React.ReactNode) => <ReaderLayout>{page}</ReaderLayout>