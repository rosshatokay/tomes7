import Author from "@/interfaces/author";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Link } from "@inertiajs/react";

interface Props {
	author: Author
}

export default function AuthorCard({ author }: Props) {
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
			<Button>Follow</Button>
		</div>
	)
}