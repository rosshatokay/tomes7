import { BookCard } from "@/components/partials/BookCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Book } from "@/interfaces/book"
import { createBreadcrumbs } from "@/lib/utils"
import { Head, useHttp } from "@inertiajs/react"
import { BookAlertIcon, MinusIcon, PlusIcon, ShareIcon } from "lucide-react"
import React, { useState } from "react"

interface Props {
	author: {
		full_name: string
		avatar_url: string
		bio: string
		slug: string
		is_followed: boolean
	}
	books: Book[]
}

export default function AuthorPage({ author, books }: Props) {
	const [isFollowing, setIsFollowing] = useState<boolean>(author.is_followed)
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: "Authors", path: "/authors" },
		{ label: author.full_name, path: "" },
	]
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
		<>
			<Head>
				<title>{author.full_name}</title>
			</Head>
			<div>
				<div className="large-container mt-2 mb-4">
					{createBreadcrumbs(crumbs)}
				</div>
				<div className="large-container">
					<div className="flex-center flex-col gap-4 pt-6 py-20">
						<Avatar className={"mb-2 size-16"}>
							<AvatarImage src={author.avatar_url} />
							<AvatarFallback className={"text-xl"}>{author.full_name[0]}</AvatarFallback>
						</Avatar>
						<div className="text-center mb-2">
							<h1 className="text-2xl mb-2">{author.full_name}</h1>
							<p className="max-w-lg text-center text-subtle line-clamp-3">{author.bio}</p>
						</div>
						<div className="flex gap-2 items-center">
							<Button
								className={"rounded-full"}
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
							<Tooltip>
								<TooltipTrigger delay={0} render={<Button variant={"outline"} size={"icon"} className={"rounded-full"}><ShareIcon /></Button>} />
								<TooltipContent>Share</TooltipContent>
							</Tooltip>
						</div>
					</div>
					{books?.length > 0 && (
						<div className="grid grid-cols-4 gap-2">
							{books?.map((book, index) => <BookCard key={index} book={book} />)}
						</div>
					)}
					{books?.length === 0 && (
						<Empty className="border">
							<EmptyHeader>
								<EmptyMedia variant={"icon"}><BookAlertIcon /></EmptyMedia>
								<EmptyTitle>No books yet</EmptyTitle>
								<EmptyDescription>Looks like none of {author.full_name}'s books are currently available on Tomes. Check back again soon.</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
				</div>
			</div>
		</>
	)
}