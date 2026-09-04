import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "timeago.js";

interface Props {
	activity: {
		user: {
			avatar_url: string
			username: string
		}
		subject: string
		action: "saved_a_book" | "added_a_review" | "started_reading"
		created_at: Date
	}
}

const formatAction = (action: string) => {
	switch (action) {
		case "saved_a_book": return "saved "
		case "started_reading": return "started reading "
		case "added_a_review": return "reviewed "
	}
}

export default function ActivityCard({ activity }: Props) {
	const user = activity.user

	return (
		<div className="p-4 bg-card rounded-xl mb-2">
			<div className="flex gap-2">
				<Avatar className={"size-10"}>
					<AvatarImage src={user.avatar_url} />
					<AvatarFallback>{user.username[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h3>{user.username} <span className="font-normal text-foreground/70">{formatAction(activity.action)}</span> {activity.subject}</h3>
					<p className="text-sm text-subtle">{format(activity.created_at.toString())}</p>
				</div>
			</div>
		</div>
	)
}