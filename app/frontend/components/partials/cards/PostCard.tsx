import { RatingStars } from "@/components/partials/RatingStars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HeartIcon, MessageSquareIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Post } from "@/interfaces/post";
import { format } from "timeago.js";

export default function PostCard({ post }: { post: Post }) {
	return (
		<div className="bg-card p-4 rounded-xl flex flex-col gap-6">
			<div className="flex items-center gap-4">
				<Avatar className={"size-10"}>
					<AvatarImage src={post.user.avatar_url} />
					<AvatarFallback>{post.user.username[0]}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-1">
					<h3 className="leading-none">{post.user.username}</h3>
					<p className="text-subtle text-sm leading-none">reviewed a book</p>
				</div>
			</div>
			<div className="flex gap-4">
				<img className="w-20 aspect-book bg-card rounded-sm" src={post.book.cover_url} alt={`${post.book.title}'s thumbnail`} />
				<div className="flex flex-col flex-1 py-2">
					<div className="font-medium">{post.book.title}</div>
					<div className="text-subtle text-sm">{post.book.author_names}</div>
					<div className="flex items-center gap-2 mt-auto">
						<RatingStars rating={post.score} />
						<div className="text-subtle/60 text-sm">{format(post.created_at)}</div>
					</div>
				</div>
			</div>
			<div className="line-clamp-3">
				<p className="mb-4">A somewhat disappointing follow up after years of waiting</p>
				<p>It lacks the naïveté and theatricality of her last two albums, instead opting for a consistently more somber tone that works against the rather simple and at times amateurish lyricism that she hasn’t really changed. While that lyricism previously had a certain charm and strong emotional pull, the production surrounding it here makes the whole thing feel like a bland Elliott Smith/Sun Kil Moon imitation, without the solid writing needed to carry it.</p>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex gap-0 -mx-2">
					<Button variant={"ghost"} className={"text-subtle"}>
						<MessageSquareIcon />
						<span>4 comments</span>
					</Button>
					<Button variant={"ghost"} className={"text-subtle"}>
						<HeartIcon />
						<span>Like</span>
					</Button>
				</div>
				<Button variant={"ghost"} size={"icon"} className={"text-subtle"}><MoreHorizontalIcon /></Button>
			</div>
		</div>
	)
}