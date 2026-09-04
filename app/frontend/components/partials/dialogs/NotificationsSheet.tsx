import { Sheet, SheetContent } from "@/components/ui/sheet";
import Modal from "@/interfaces/modals";
import { notificationsProvider } from "@/lib/notificationsProvider";

export default function NotificationsSheet({isOpen, setIsOpen}: Modal) {
	const notifs = notificationsProvider({isOpen: isOpen, setIsOpen: setIsOpen})
	
	return (
		<Sheet open={isOpen} onOpenChange={open => !open && setIsOpen(false)}>
			<SheetContent className={"!w-full !max-w-full"}>
				{notifs.content}
			</SheetContent>
		</Sheet>
	)
}