import Author from "@/interfaces/author";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Link, useHttp } from "@inertiajs/react";
import React, { useState } from "react";
import { toast } from "../../ui/toast";
import { Spinner } from "../../ui/spinner";
import { MinusIcon, PlusIcon } from "lucide-react";
import { AuthProps } from "@/interfaces/auth";

interface Props {
	author: Author
	auth: AuthProps
}

export default function AuthorCard({ author, auth }: Props) {
	const [isFollowing, setIsFollowing] = useState<boolean>(author.is_followed)
	const followHttp = useHttp({ slug: author.slug })

	const handleFollowBtn = () => {
		if (!auth.user) {
			toast.add({description: "Account required to complete this account"})
			return
		}
		
		followHttp.post(isFollowing ? '/authors/unfollow' : '/authors/follow', {
			onSuccess: (res: any) => {
				if (res.success) {
					toast.add({ description: isFollowing ? "Stopped following author" : "Started following author" })
					setIsFollowing(!isFollowing)
				}
			},
			onError(errors) {
				errors.author.map(err => toast.add({ description: err }))
			},
		}).catch(err => toast.add({ description: "Something went wrong try again" }))
	}

	return (
		<div className="bg-card rounded-xl md:py-12 p-5 flex md:items-center md:justify-center flex-col gap-4 relative hover:bg-black/10 dark:hover:bg-white/10 transition">
			<Link href={author.permalink} className="absolute inset-0 z-1" />
			<div className="flex md:flex-col items-center gap-4">
				<Avatar className={"md:size-16 size-12 md:mx-auto"}>
					<AvatarImage src={author.avatar_url} />
					<AvatarFallback>{author.full_name[0]}</AvatarFallback>
				</Avatar>
				<div className="md:text-center">
					<h2 className="font-medium">{author.full_name}</h2>
					<p className="text-subtle text-sm">{author.books_count} {author.books_count === 1 ? "book" : "books"}</p>
				</div>
			</div>
			<Button
				className={"rounded-full relative z-2"}
				onClick={handleFollowBtn} variant={(isFollowing || followHttp.processing) ? "secondary" : "default"}
				disabled={followHttp.processing}
			>
				{isFollowing ? (
					<React.Fragment>
						{followHttp.processing ? <Spinner /> : <MinusIcon />} Unfollow
					</React.Fragment>
				) : (
					<React.Fragment>
						{followHttp.processing ? <Spinner /> : <PlusIcon />} Follow
					</React.Fragment>
				)}
			</Button>
		</div>
	)
}