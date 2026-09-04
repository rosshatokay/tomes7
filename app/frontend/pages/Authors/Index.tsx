import AuthorCard from "@/components/partials/cards/AuthorCard";
import MainHeader from "@/components/partials/MainHeader";
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
			<MainHeader title="Authors" description="Discover the authors behind the greatest works" />
			<div className="large-container pb-6">
				<div className="grid 2xl:grid-cols-5 md:grid-cols-4 gap-2">
					{authors.map(author => <AuthorCard key={author.permalink} author={author} />)}
				</div>
			</div>
		</>
	)
}