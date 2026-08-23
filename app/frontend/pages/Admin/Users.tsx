import { GoogleIcon } from "@/assets/socials/GoogleIcon";
import { TablePagination } from "@/components/partials/TablePagination";
import CustomTable, { Column } from "@/components/partials/CustomTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PaginationMeta } from "@/interfaces/pagination";
import { User } from "@/interfaces/user";
import { Deferred, Head } from "@inertiajs/react";
import { AtSignIcon, CalendarIcon, ClockIcon, FingerprintPatternIcon, ListIcon, MailIcon, UserIcon } from "lucide-react";
import { format } from "timeago.js";

interface Props {
	users_count: number
	users: User[]
	pagination: PaginationMeta
}

export default function UsersPage({ users_count, users, pagination }: Props) {
	const cols: Column[] = [
		{
			key: "username",
			label: {
				icon: <UserIcon size={14} />,
				text: "User"
			},
			render: (row) => (
				<div className="flex items-center gap-2">
					<Avatar className={"size-6"}>
						<AvatarImage src={row.avatar_url} />
						<AvatarFallback className={"text-xs"}>{row.username[0]}</AvatarFallback>
					</Avatar>
					{row.username}
				</div>
			)
		},
		{
			key: "email",
			label: {
				icon: <MailIcon size={14} />,
				text: "Email"
			}
		},
		{
			key: "provider",
			label: {
				icon: <FingerprintPatternIcon size={14} />,
				text: "Provider"
			},
			render: (row) => {
				return (
					<Badge variant={"secondary"} className="text-[13px] font-normal">
						{row.provider === null ? <AtSignIcon /> : <GoogleIcon />}
						<span>{row.provider === null ? "Email" : row.provider}</span>
					</Badge>
				)
			}
		},
		{
			key: "last_session",
			label: {
				icon: <ClockIcon size={14} />,
				text: "Last session"
			},
			render: (row) => (
				<span>{row.last_session ? format(row.last_session) : "N/A"}</span>
			)
		},
		{
			key: "created_at",
			label: {
				icon: <CalendarIcon size={14} />,
				text: "Created at"
			},
			render: (row) => (
				<span>{format(row.created_at)}</span>
			)
		}
	]

	return (
		<>
			<Head>
				<title>Users</title>
			</Head>
			<div className="h-full flex flex-col">
				<div className="text-sm h-12 flex items-center justify-between px-4 border-b">
					<span className="text-subtle flex items-center gap-2"><ListIcon size={16} /> All users • {users_count}</span>
				</div>
				<Deferred data={"users"} fallback={<div className="flex-center h-full"><Spinner className="size-6 text-subtle" /></div>}>
					<div className="w-full h-full overflow-y-auto">
						<CustomTable columns={cols} rows={users || []} />
					</div>
				</Deferred>
				<TablePagination meta={pagination} />
			</div>
		</>
	)
}