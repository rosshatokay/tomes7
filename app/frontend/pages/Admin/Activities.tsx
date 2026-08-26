import CustomTable, { Column } from "@/components/partials/CustomTable";
import { TablePagination } from "@/components/partials/TablePagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { PaginationMeta } from "@/interfaces/pagination";
import { Deferred, Head } from "@inertiajs/react";
import { ActivitySquareIcon, ListIcon, UserIcon } from "lucide-react";

interface Activity {
	id: string
	title: string
}

interface Props {
	pagination: PaginationMeta,
	activities: Activity[]
}

export default function ActivitiesPage({ activities, pagination }: Props) {
	const cols: Column[] = [
		{
			key: "user",
			label: {
				icon: <UserIcon size={14} />,
				text: "User"
			},
			render(row) {
				return (
					<div className="flex items-center gap-2">
						<Avatar className={"size-6"}>
							<AvatarImage src={row.user.avatar_url} />
							<AvatarFallback className={"text-xs"}>{row.user.username[0]}</AvatarFallback>
						</Avatar>
						{row.user.username}
					</div>
				)
			},
		},
		{
			key: "action",
			label: {
				icon: <ActivitySquareIcon size={14} />,
				text: "Action"
			}
		},
		{
			key: "null",
			label: {
				icon: <ActivitySquareIcon size={14} />,
				text: "Subject"
			}
		}
	]

	console.log(activities)

	return (
		<>
			<Head>
				<title>Users</title>
			</Head>
			<div className="h-full flex flex-col">
				<div className="text-sm min-h-12 h-12 flex items-center justify-between px-4 border-b">
					<span className="text-subtle flex items-center gap-2"><ListIcon size={16} /> All activities</span>
				</div>
				<Deferred data={"activities"} fallback={<div className="flex-center h-full"><Spinner className="size-6 text-subtle" /></div>}>
					<div className="w-full h-full overflow-y-auto">
						<CustomTable columns={cols} rows={activities || []} />
					</div>
				</Deferred>
				<TablePagination meta={pagination} />
			</div>
		</>
	)
}