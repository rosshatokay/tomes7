import { BellIcon, BellOffIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useState } from "react";
import { Link, useHttp } from "@inertiajs/react";
import { toast } from "../ui/toast";
import { format } from "timeago.js"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Spinner } from "../ui/spinner";

interface Notification {
	kind: "user_followed" | "accepted_invite"
	created_at: Date
	notifier?: {
		avatar: string
		username: string
	}
	permalink?: string
}

export default function NotificationsPopover() {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [notifications, setNotifications] = useState<Notification[]>([])
	const notifsHttp = useHttp()
	let timer: ReturnType<typeof setTimeout>

	const getNotifications = () => {
		notifsHttp.get('/api/v1/notifications', {
			onSuccess: (data: any) => {
				setNotifications(data)
			}
		}).catch(_ => toast.add({ description: "Something went wrong. Try again soon." }))
	}

	useEffect(() => {
		if (!isOpen) {
			timer = setTimeout(() => {
				setNotifications([])
			}, 100);
			return
		}

		clearTimeout(timer)
		getNotifications()
	}, [isOpen])

	const formatKind = (kind: Notification['kind']) => {
		if (kind === "user_followed") return "started following you"
		if (kind === "accepted_invite") return "accepted your invite"
	}

	return (
		<div>
			<Popover onOpenChange={open => setIsOpen(open)}>
				<PopoverTrigger render={<Button variant={"ghost"} size={"icon"}><BellIcon /></Button>} />
				<PopoverContent align="end" className={"w-90 p-1 gap-1"}>
					<p className="text-sm text-subtle p-2 pt-2 pb-0">Notifications</p>

					{notifsHttp.processing && <div className="flex-center h-full p-10"><Spinner className="size-6" /></div>}
					{!notifsHttp.processing && notifications.map((notif, index) => (
						<div key={index} className="relative flex gap-3 items-center p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition">
							<Link href={notif.permalink || "/"} className="absolute inset-0 z-1" />
							<Avatar>
								<AvatarImage src={notif.notifier?.avatar} />
								<AvatarFallback>{notif.notifier?.username[0]}</AvatarFallback>
								<AvatarBadge><PlusIcon /></AvatarBadge>
							</Avatar>
							<div>
								<div>{notif.notifier?.username} <span className="text-subtle">{formatKind(notif.kind)}</span></div>
								<div className="text-subtle text-[13px]">{format(notif.created_at)}</div>
							</div>
						</div>
					))}
					{!notifsHttp.processing && notifications.length === 0 && (
						<div className="p-10 flex-center flex-col gap-4 text-subtle text-center">
							<BellOffIcon />
							<p className="max-w-48">You haven't received any notifications yet.</p>
						</div>
					)}
				</PopoverContent>
			</Popover>
		</div>
	)
}