import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import copyToClipboard, { cn, useIsMobile } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CopyIcon, MailIcon, MoreVerticalIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { FacebookIcon, RedditIcon, XIcon } from "@/assets/socials"
import { toast } from "../ui/toast"

interface ShareDialogProps {
	url: string
	isOpen: boolean
	setIsOpen: (state: boolean) => void
}

const platforms = [
	{
		icon: <RedditIcon fill="white" size={24} />,
		bgColor: "bg-[#E55227]",
		label: "Reddit",
		shareLink: ""
	},
	{
		icon: <XIcon fill="white" size={24} />,
		bgColor: "bg-black",
		label: "X",
		shareLink: "https://twitter.com/intent/post?url="
	},
	{
		icon: <FacebookIcon fill="white" size={24} />,
		bgColor: "bg-[#425894]",
		label: "Facebook",
		shareLink: "https://www.facebook.com/sharer/sharer.php?u="
	},
	{
		icon: <MailIcon />,
		bgColor: "bg-card",
		label: "Email",
		shareLink: "mailto:?subject=&body=",
	},
	{
		icon: <MoreVerticalIcon />,
		bgColor: "bg-card",
		label: "More",
		shareLink: "https://wa.me/?text=",
		onClick: () => console.log("clicked")
	},
]

export default function ShareDialog({ url, isOpen, setIsOpen }: ShareDialogProps) {
	const isMobile = useIsMobile()
	const [isCopied, setIsCopied] = useState<boolean>(false)
	
	const handleUrlCopy = () => {
		setIsCopied(true)
		copyToClipboard(url)

		if (isMobile) {
			setIsOpen(false)
			toast.add({description: "Link copied"})
		}
	}
	
	return (
		<Dialog open={isOpen} onOpenChange={(e) => !e ? setIsOpen(false) : undefined}>
			<DialogContent className={"sm:max-w-md"} autoFocus={false}>
				<DialogHeader>
					<DialogTitle>Share book</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-5 pt-2">
					<Field>
						<FieldLabel>Copy link</FieldLabel>
						<Field orientation="horizontal">
							<Input tabIndex={-1} autoFocus={false} type="text" readOnly value={url} />
							<Tooltip onOpenChange={(e) => !e ? setIsCopied(false) : null}>
								<TooltipTrigger delay={0} closeOnClick={false} onClick={handleUrlCopy} render={<Button variant={"secondary"} size={"icon"}><CopyIcon /></Button>} />
								<TooltipContent>{isCopied ? "URL Copied" : "Copy URL"}</TooltipContent>
							</Tooltip>
						</Field>
					</Field>
					<div>
						<div className="font-medium">Share to</div>
						<div className="grid grid-cols-5 md:gap-2">
							{platforms.map((item, i) => (
								<a href={`${item.shareLink}${url}`} target="_blank" className="flex flex-col gap-2 items-center md:p-4 p-2 group" onClick={() => item.onClick ? item.onClick() : undefined} key={i}>
									<div className={cn("w-full aspect-square rounded-full flex-center", item.bgColor)}>
										{item.icon}
									</div>
									<span className="!text-xs text-subtle group-hover:text-foreground transition">{item.label}</span>
								</a>
							))}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}