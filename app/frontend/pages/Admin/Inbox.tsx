import CustomTable, { Column } from "@/components/partials/CustomTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import Message from "@/interfaces/message";
import { SimpleFormat } from "@/lib/utils";
import { Deferred, useForm, useHttp } from "@inertiajs/react";
import { InboxIcon, ListIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import strftime from "strftime";

interface Props {
	messages_count: number
	messages: Message[]
}

function formatMessageTime(message: Message) {
	const createdAt = new Date(message.created_at);
	const now = new Date();

	const diffInMilliseconds = +now - +createdAt;
	const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

	if (diffInMilliseconds < twentyFourHoursInMs && diffInMilliseconds >= 0) {
		return strftime('%R', createdAt); // Outputs: HH:MM
	} else {
		return strftime('%b %d', createdAt); // Outputs: Month Name DD
	}
}

export default function InboxPage({ messages, messages_count }: Props) {
	const [activeMessage, setActiveMessage] = useState<Message | null>(null)
	const http = useForm({ ids: [""] })
	const columns: Column[] = [
		{
			key: "_",
			label: {
				text: "User"
			},
			render: (row) => (
				<div className="flex items-center gap-3">
					<Avatar className={"size-6"}>
						<AvatarImage src={row.user.avatar_url} />
						<AvatarFallback>{row.user.username[0]}</AvatarFallback>
					</Avatar>
					{row.user.username}
				</div>
			)
		},
		{
			key: "__",
			label: {
				text: "Message"
			},
			render: (row) => (
				<div className="flex justify-between gap-8 min-w-0">
					<div className="font-medium truncate">{row.content.subject} <span className="text-subtle font-normal">{row.content.body}</span></div>
					<div className="text-subtle whitespace-nowrap">{formatMessageTime(row as Message)}</div>
				</div>
			)
		}
	]
	const [messageIdsToDelete, setMessageIdsToDelete] = useState<string[]>([""])

	const handleRowClick = (message: Message) => setActiveMessage(message)

	const handleMessageDelete = () => {
		if (!messageIdsToDelete.length) return

		http.setData('ids', messageIdsToDelete)
		http.delete('/admins/inbox', {
			onSuccess: (res: any) => {
				if (res.success) {
					setActiveMessage(null)
					toast.add({ description: "Message deleted" })
				}
			},
			onError: (res) => console.log('error')
		})
	}

	const handleRowCheck = (selectedIds: string[]) => {
		setMessageIdsToDelete(selectedIds)
	}

	return (
		<>
			<div className="h-full flex flex-col">
				<div className="text-sm min-h-12 h-12 flex items-center justify-between px-4 border-b">
					<span className="text-subtle flex items-center gap-2"><ListIcon size={16} /> Inbox • {messages_count}</span>
					<div className="flex gap-1">
						{messageIdsToDelete.length > 0 && (
							<Button variant={"secondary"} size={"icon-sm"} onClick={handleMessageDelete}><TrashIcon /></Button>
						)}
					</div>
				</div>
				<Deferred data="messages" fallback={<div className="flex-center h-full"><Spinner className="size-6 text-subtle" /></div>}>
					<div className="w-full h-full overflow-y-auto">
						{messages?.length > 0 ? (
							<CustomTable columns={columns} rows={messages || []} hideRightBorders={true} onRowClick={handleRowClick} onCheck={handleRowCheck} />
						) : (
							<div className="flex-center h-full">
								<Empty>
									<EmptyHeader>
										<EmptyMedia variant={"icon"}><InboxIcon /></EmptyMedia>
										<EmptyTitle>No messages</EmptyTitle>
										<EmptyDescription>Looks like there aren't any messages in here.</EmptyDescription>
									</EmptyHeader>
								</Empty>
							</div>
						)}
					</div>
				</Deferred>
				<Sheet open={!!activeMessage} onOpenChange={(open) => !open && setActiveMessage(null)}>
					<SheetContent>
						<div className="flex flex-col gap-4 p-4 pt-6">
							<div className="grid grid-cols-[64px_1fr]">
								<div className="text-subtle">From</div>
								<div className="">{activeMessage?.user.username}</div>
							</div>
							<div className="grid grid-cols-[64px_1fr]">
								<div className="text-subtle">Date</div>
								<div className="">{strftime('%a %d %b at %R%P', new Date(activeMessage?.created_at || ""))}</div>
							</div>
							{activeMessage?.content.subject}
							<hr />
							<div className="text-subtle">Body</div>
							{SimpleFormat(activeMessage?.content.body || "")}
						</div>
						<SheetFooter>
							<Button variant={"secondary"} onClick={handleMessageDelete} tabIndex={-1} disabled={http.processing}>
								{http.processing ? <Spinner /> : <TrashIcon />}
								Delete
							</Button>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</div>
		</>
	)
}