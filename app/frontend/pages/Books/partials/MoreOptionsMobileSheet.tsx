import { WikipediaIcon } from "@/assets/socials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import Author from "@/interfaces/author";
import { cn, handleNativeShare } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { GlassesIcon, HeartIcon, ShareIcon, StarIcon, UserIcon } from "lucide-react";
import { BookPageProps } from "../Show";

interface Props {
	isOpen: boolean
	setIsOpen: (state: boolean) => void
	author: Author
	isSaved: boolean
	isSaveProcessing: boolean
	handleSavedBtn: () => void
	book: BookPageProps['book']
}

export default function MoreOptionsMobileSheet({
	isOpen,
	setIsOpen,
	author,
	isSaved,
	isSaveProcessing,
	handleSavedBtn,
	book
}: Props) {
	const btnOptions = [
		{
			icon: <StarIcon className="!size-5" />,
			label: "Rate this book",
			onClick: () => { }
		},
		{
			icon: <UserIcon className="!size-5" />,
			label: `More from ${author.full_name}`,
			onClick: () => { }
		},
		{
			icon: <WikipediaIcon fill="var(--foreground)" size={20} className="!w-5 !h-5" />,
			label: `Read Wikipedia page`,
			onClick: () => { }
		},
	]

	return (
		<Sheet open={isOpen} onOpenChange={open => !open && setIsOpen(false)}>
			<SheetContent side="bottom" className={"rounded-t-xl p-4 px-0 gap-0"} showCloseButton={false}>
				<div className="grid grid-cols-3 gap-4 px-2 pb-4">
					<Link className="flex-center flex-col gap-2 bg-black/5 active:bg-black/10 dark:bg-white/5 dark:active:bg-white/10 rounded-lg py-3 transition">
						<GlassesIcon />
						Read
					</Link>
					<button
						className={cn("flex-center flex-col gap-2 bg-black/5 active:bg-black/10 dark:bg-white/5 dark:active:bg-white/10 rounded-lg py-3 transition", isSaveProcessing && "opacity-60")}
						onClick={handleSavedBtn}
						disabled={isSaveProcessing}
					>
						{isSaveProcessing ? <Spinner className="!size-6" /> : (
							isSaved ? <HeartIcon fill="red" stroke="none" /> : <HeartIcon />
						)}
						{isSaved ? "Saved" : "Save"}
					</button>
					<button
						onClick={() => handleNativeShare({ url: book.share_url })}
						className="flex-center flex-col gap-2 bg-black/5 active:bg-black/10 dark:bg-white/5 dark:active:bg-white/10 rounded-lg py-3 transition">
						<ShareIcon />
						Share
					</button>
				</div>
				<hr />
				<div className="flex flex-col gap-1 px-2 py-4">
					{btnOptions.map((btn, index) => (
						<Button key={index} variant={"ghost"} className={"justify-start gap-3 px-4 active:!bg-muted h-11 rounded-lg"} size={"lg"}>
							{btn.icon}
							<span className="text-base font-normal">{btn.label}</span>
						</Button>
					))}
				</div>
				<hr />
				<div className="px-2 pt-2">
					<Button
						className={"w-full h-11 active:!bg-muted"}
						size={"lg"}
						variant={"ghost"}
						onClick={() => setIsOpen(false)}
					>Close</Button>
				</div>
			</SheetContent>
		</Sheet>
	)
}