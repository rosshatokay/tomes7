import AuthorCard from "@/components/partials/cards/AuthorCard";
import MainBreadcrumbs from "@/components/partials/MainBreadcrumbs";
import MainHeader from "@/components/partials/MainHeader";
import SortSelect from "@/components/partials/SortSelect";
import { Spinner } from "@/components/ui/spinner";
import { AuthProps } from "@/interfaces/auth";
import Author from "@/interfaces/author";
import { InfiniteScroll } from "@inertiajs/react";

interface PageProps {
	auth: AuthProps
	authors: Author[]
	current_sort: string
}

export default function AuthorsPage({ authors, current_sort = "recently-added" }: PageProps) {
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: "Explore", path: "/explore" },
		{ label: "Authors", path: "/authors" },
	]

	const sortItems = [
		{ label: "Recently added", value: "recently-added" },
		{ label: "Most followed", value: "most-followed" },
	]

	return (
		<>
			<MainBreadcrumbs breadcrumbs={crumbs} />
			<MainHeader title="Authors" description="Discover the authors behind the greatest works" />
			<div className="large-container pb-12">
				<InfiniteScroll data="authors" loading={<div className="flex-center pt-10"><Spinner className="size-6" /></div>}>
					{authors.length > 0 && (
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<div className="text-sm text-subtle">Sort by</div>
								<SortSelect endpoint={`/authors`} currentSort={current_sort} sortItems={sortItems} />
							</div>
							<div className="text-sm text-subtle">Showing {authors.length} {authors.length === 1 ? "author" : "authors"}</div>
						</div>
					)}
					<div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-2">
						{authors.map(author => <AuthorCard key={author.permalink} author={author} />)}
					</div>
				</InfiniteScroll>
			</div>
		</>
	)
}