import { Book } from "@/interfaces/book"
import ReaderLayout from "@/layouts/ReaderLayout"
import { useHttp } from "@inertiajs/react"
import { ChevronRightIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { EpubViewer, ReactEpubViewer, ViewerRef } from "react-epub-viewer"

interface WithEpub extends Book {
	epub_file_path: string
}

interface Props {
	book: WithEpub
}

export default function ReadBookPage({ book }: Props) {
	const [isReady, setIsReady] = useState(false)
	const viewerRef = useRef<ViewerRef>(null)

	useEffect(() => {
		setIsReady(true)
	}, [])

	return (
		<div className="h-screen w-full flex flex-col bg-white">
			<div className="h-12 px-4 flex items-center">
				<div className="flex items-center gap-2 text-sm">
					<div className="w-4 aspect-square bg-yellow-500 rounded-[3px]"></div>
					<h1 className="">{book.title}</h1>
					<ChevronRightIcon size={14} />
					<h1 className="">{book.title}</h1>
				</div>
			</div>
			{isReady ? (
				<div className="overflow-hidden rounded-xl pb-16 flex flex-col h-full">
					<div className="pt-6"></div>
					<div className="h-full">
						<ReactEpubViewer
							url={book.epub_file_path}
							ref={viewerRef}
							epubFileOptions={{ openAs: "epub" }}
							loadingView={<div></div>}
						/>
					</div>
				</div>
			) : (
				<div>loading</div>
			)}
			<div className="p-10"></div>
		</div>
	)
}

ReadBookPage.layout = (page: React.ReactNode) => <ReaderLayout>{page}</ReaderLayout>