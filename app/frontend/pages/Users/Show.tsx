import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createBreadcrumbs } from "@/lib/utils";
import { Head } from "@inertiajs/react";

interface Props {
	user: {
		username: string
		avatar_url: string
		bio: string
	}
}

export default function ProfilePage({ user }: Props) {
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: user.username, path: `/@${user.username}` }
	]

	return (
		<>
			<Head>
				<title>{user.username}</title>
			</Head>
			<div>
				<div className="large-container mt-2 mb-4">
					{createBreadcrumbs(crumbs)}
				</div>
				<div className="large-container">
					<div className="pt-6 py-20 max-w-xl mx-auto flex justify-between">
						<div className="flex gap-4">
							<Avatar className={"mb-2 size-16"}>
								<AvatarImage src={user.avatar_url} />
								<AvatarFallback className={"text-xl"}>{user.username[0]}</AvatarFallback>
							</Avatar>
							<div className="mb-2">
								<h1 className="text-2xl">{user.username}</h1>
								<p className="text-subtle">@{user.username}</p>
								{user.bio && <p className="max-w-lg text-center text-subtle line-clamp-3">{user.bio}</p>}
							</div>
						</div>
						<Button className={"rounded-full"}>Follow</Button>
					</div>
				</div>
			</div>
		</>
	)
}