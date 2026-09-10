import { BellIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { notificationsProvider } from "@/lib/notificationsProvider";

export default function NotificationsPopover() {
	const [isOpen, setIsOpen] = useState(false)
	const notifs = notificationsProvider({ isOpen: isOpen, setIsOpen: setIsOpen })

	return (
		<div>
			<Popover open={isOpen} onOpenChange={open => !open && setIsOpen(false)}>
				<Tooltip>
					<TooltipTrigger delay={0} onClick={() => setIsOpen(true)} render={<PopoverTrigger render={<Button variant={"ghost"} size={"icon"}><BellIcon /></Button>} />} />
					<TooltipContent>Notifications</TooltipContent>
				</Tooltip>
				<PopoverContent align="end" className={"w-90 p-1 gap-1"}>
					<p className="text-sm text-subtle p-2 pt-2 pb-0">Notifications</p>
					{notifs.content}					
				</PopoverContent>
			</Popover>
		</div>
	)
}