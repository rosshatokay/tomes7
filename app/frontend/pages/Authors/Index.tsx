import AuthorCard from "@/components/partials/AuthorCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AuthProps } from "@/interfaces/auth";
import Author from "@/interfaces/author";

interface PageProps {
	auth: AuthProps
	authors: Author[]
}

export default function AuthorsPage({ authors }: PageProps) {
	return (
		<>
			<div className="large-container flex-center flex-col h-[30vh] min-h-50">
				<h1 className="text-5xl mb-4">Authors</h1>
				<p className="text-subtle">Discover the authors behind the greatest works</p>
			</div>
			<div className="large-container pb-6">
				<div className="grid grid-cols-4 gap-2">
					{authors.map(author => <AuthorCard key={author.permalink} author={author} />)}
				</div>
			</div>
		</>
	)
}