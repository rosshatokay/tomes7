import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Modal from "@/interfaces/modals";
import { notificationsProvider } from "@/lib/notificationsProvider";

export default function NotificationsSheet({ isOpen, setIsOpen }: Modal) {
	const notifs = notificationsProvider({ isOpen: isOpen, setIsOpen: setIsOpen })

	return (
		<Sheet open={isOpen} onOpenChange={open => !open && setIsOpen(false)}>
			<SheetContent className={"!w-full !max-w-full gap-0"}>
				<SheetHeader>
					<SheetTitle>Notifications</SheetTitle>
				</SheetHeader>
				<div className="p-4 px-2 pt-0 overflow-y-auto">
					{notifs.content}
				</div>
			</SheetContent>
		</Sheet>
	)
}