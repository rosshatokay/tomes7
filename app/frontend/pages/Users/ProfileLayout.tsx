import { Fragment } from "react/jsx-runtime"
import { Link, useHttp, usePage } from "@inertiajs/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProfileProps } from "./Show";
import { MinusIcon, PlusIcon, ShareIcon } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import ShareDialog from "@/components/partials/ShareDialog";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import BackBtnHeader from "@/components/partials/nav/BackBtnHeader";

interface Props extends ProfileProps {
	children: PropsWithChildren['children']
}

export default function ProfileLayout({ user, children }: Props) {
	const [isShareOpen, setIsShareOpen] = useState(false)
	const [isFollowing, setIsFollowing] = useState<boolean>(user.is_followed)
	const followHttp = useHttp({ username: user.username })

	const handleFollowBtn = () => {
		if (user.is_current) return

		followHttp.post(`/api/v1/users/follow`, {
			onSuccess: (res: any) => {
				if (res.success) {
					toast.add({ description: isFollowing ? "Stopped following user" : "Started following user" })
					setIsFollowing(!isFollowing)
					!isFollowing ? user.followers_count++ : user.followers_count--
				}
			},
			onError(errors) {
				errors.user.map(err => toast.add({ description: err }))
			},
		}).catch(err => toast.add({ description: "Something went wrong try again" }))
	}

	const tabs = [
		{ label: "Bookshelf", path: `/@${user.username}` },
		{ label: "Activity", path: `/@${user.username}/activity` },
		{ label: "Reviews", path: `/@${user.username}/reviews` },
	]

	return (
		<Fragment>

			<BackBtnHeader>
				<Button size={"icon-lg"} variant={"secondary"} onClick={() => setIsShareOpen(true)}><ShareIcon /></Button>
				{/* <Button size={"icon-lg"} variant={"secondary"} onClick={() => setIsMoreOptionsOpen(true)}><MoreHorizontalIcon /></Button> */}
			</BackBtnHeader>
			<div className="large-container">
				<div className="pt-6 py-20 max-w-2xl mx-auto">
					<div className="flex justify-between">
						<div className="flex flex-col gap-4">
							<Avatar className={"size-16"}>
								<AvatarImage src={user.avatar_url} />
								<AvatarFallback className={"text-xl"}>{user.username[0]}</AvatarFallback>
							</Avatar>
							<div className="mb-2">
								<h1 className="text-xl">{user.username}</h1>
								{user.bio && <p className="max-w-lg text-subtle line-clamp-3">{user.bio}</p>}
								<div className="flex items-center gap-2 justify-center mt-2">
									<h3 className="text-[15px] !font-normal">{user.followers_count} <span className="text-subtle/75">{user.followers_count === 1 ? "follower" : "followers"}</span></h3>
									<span className="size-1 rounded-full bg-foreground/40 inline-flex"></span>
									<h3 className="text-[15px] !font-normal">{user.followings_count || 0} <span className="text-subtle/75">following</span></h3>
								</div>
							</div>
						</div>
						<div className="flex gap-1">
							<Tooltip>
								<TooltipTrigger render={
									<Button
										onClick={() => setIsShareOpen(true)}
										className={"rounded-full"}
										variant={"outline"}
										size={"icon"}><ShareIcon /></Button>
								}
								/>
								<TooltipContent>Share profile</TooltipContent>
							</Tooltip>
							{!user.is_current && (
								<Button className={"rounded-full"} onClick={handleFollowBtn} variant={followHttp.processing || isFollowing ? "secondary" : "default"} disabled={followHttp.processing}>
									{isFollowing ? (
										<Fragment>
											{followHttp.processing ? <Spinner /> : <MinusIcon />}
											Unfollow
										</Fragment>
									) : (
										<Fragment>
											{followHttp.processing ? <Spinner /> : <PlusIcon />}
											Follow
										</Fragment>
									)}
								</Button>
							)}
						</div>
					</div>
					<div className="my-6">
						<div className="flex gap-1">
							{tabs.map(tab => {
								const isActive = tab.path === usePage().url.split("?")[0]

								return (
									<Button
										key={tab.path}
										variant={isActive ? "secondary" : "ghost"}
										className={cn("rounded-full", !isActive && "opacity-70")}
										nativeButton={false}
										render={<Link href={tab.path} />}
									>{tab.label}</Button>
								)
							})}
						</div>
					</div>
					{children}
				</div>
			</div>
			<ShareDialog url={user.share_url} title="Share profile" isOpen={isShareOpen} setIsOpen={setIsShareOpen} />
		</Fragment>
	)
}