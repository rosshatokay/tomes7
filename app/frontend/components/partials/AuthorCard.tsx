import Author from "@/interfaces/author";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Link, useHttp } from "@inertiajs/react";
import React, { useState } from "react";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import { MinusIcon, PlusIcon } from "lucide-react";

interface Props {
	author: Author
}

export default function AuthorCard({ author }: Props) {
	const [isFollowing, setIsFollowing] = useState<boolean>(author.is_followed)
	const followHttp = useHttp({ slug: author.slug })

	const handleFollowBtn = () => {
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
		<div className="bg-card rounded-xl py-12 flex-center flex-col gap-4 relative hover:bg-black/5 dark:hover:bg-white/10 transition">
			<Link href={author.permalink} className="absolute inset-0 z-1" />
			<Avatar className={"size-12"}>
				<AvatarImage src={author.avatar_url} />
				<AvatarFallback>{author.full_name[0]}</AvatarFallback>
			</Avatar>
			<div className="text-center">
				<h2 className="font-medium">{author.full_name}</h2>
				<p className="text-subtle text-sm">{author.books_count} {author.books_count === 1 ? "book" : "books"}</p>
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