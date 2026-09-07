import AuthorCard from "@/components/partials/cards/AuthorCard";
import MainBreadcrumbs from "@/components/partials/MainBreadcrumbs";
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
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: "Explore", path: "/explore" },
		{ label: "Authors", path: "/authors" },
	]

	return (
		<>
			<MainBreadcrumbs breadcrumbs={crumbs} />
			<MainHeader title="Authors" description="Discover the authors behind the greatest works" />
			<div className="large-container pb-6">
				<div className="grid md:grid-cols-4 gap-2">
					{authors.map(author => <AuthorCard key={author.permalink} author={author} />)}
				</div>
			</div>
		</>
	)
}