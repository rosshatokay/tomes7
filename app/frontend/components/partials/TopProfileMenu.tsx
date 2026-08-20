import { AuthProps } from "@/interfaces/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { GitPullRequestArrowIcon, GridIcon, HeartIcon, LogOutIcon, MailPlusIcon, UserIcon } from "lucide-react";
import { Link } from "@inertiajs/react";

interface Props {
	user: AuthProps['user']
}

export default function TopProfileMenu({ user }: Props) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger nativeButton={false} render={<Avatar className={"border border-transparent hover:border-foreground/50 cursor-pointer transition"}>
				<AvatarImage src={user?.avatar_url}></AvatarImage>
				<AvatarFallback>{user?.username[0]}</AvatarFallback>
			</Avatar>} />
			<DropdownMenuContent className={"w-48"} align={"end"}>
				<DropdownMenuGroup>
					{user?.is_admin && <DropdownMenuItem nativeButton={false} render={<Link href={"/admins"} />}><GridIcon /> Dashboard</DropdownMenuItem>}
					<DropdownMenuItem nativeButton={false} render={<Link href={`/@${user?.username}`} />}><UserIcon /> Profile</DropdownMenuItem>
					<DropdownMenuItem nativeButton={false} render={<Link href={"/library?tab=saved"} />}><HeartIcon /> Saved</DropdownMenuItem>
					<DropdownMenuItem><GitPullRequestArrowIcon /> Request a book</DropdownMenuItem>
					<DropdownMenuItem><MailPlusIcon /> Invite a friend</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem nativeButton={true} render={<Link href={"/logout"} method="delete" as={"button"} className="w-full" />}><LogOutIcon /> Sign out</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}