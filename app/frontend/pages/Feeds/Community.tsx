
import PostCard from "@/components/partials/cards/PostCard";
import { Button } from "@/components/ui/button";
import { Post } from "@/interfaces/post";
import { Head } from "@inertiajs/react";

interface Props {
	posts: Post[]
}

export default function CommunityPage({ posts }: Props) {
	return (
		<>
			<Head>
				<title>Community</title>
			</Head>
			<div className="large-container flex-center flex-col h-[30vh] min-h-50">
				<h1 className="text-5xl mb-4">Community</h1>
				<p className="text-subtle">Explore the Tomes Club</p>
			</div>
			<div className="max-w-2xl mx-auto px-5">
				<div className="flex gap-1 mb-4">
					<Button variant={"default"} className={"rounded-full"}>Following</Button>
					<Button variant={"secondary"} className={"rounded-full"}>Everyone</Button>
				</div>
				<div className="flex flex-col gap-4">
					{posts.map((post, index) => (
						<PostCard key={index} post={post} />
					))}
				</div>
			</div>
		</>
	)
}