import { BookCard } from "@/components/partials/cards/BookCard";
import ShareDialog from "@/components/partials/ShareDialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Book } from "@/interfaces/book";
import { createBreadcrumbs } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import ProfileLayout from "./ProfileLayout";
import MainBreadcrumbs from "@/components/partials/MainBreadcrumbs";
import BaseLayout from "@/layouts/BaseLayout";

export interface ProfileProps {
	user: {
		username: string
		avatar_url: string
		bio: string
		is_current: boolean
		share_url: string
		is_followed: boolean
		followers_count: number
		followings_count: number
	}
}

interface Props extends ProfileProps {
	books: Book[]
}

export default function ProfilePage({ user, books }: Props) {
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: user.username, path: `/@${user.username}` }
	]

	return (
		<>
			<MainBreadcrumbs breadcrumbs={crumbs} />
			<ProfileLayout user={user}>
				<div className="flex flex-col gap-2">
					{books.length > 0 && books.map(book => (
						<BookCard book={book} key={book.slug} isMobileForced={true} />
					))}
					{books.length === 0 && (
						<Empty className="border">
							<EmptyHeader>
								<EmptyMedia variant={"icon"}><InfoIcon /></EmptyMedia>
								<EmptyTitle>Nothing here</EmptyTitle>
								{user.is_current ? (
									<EmptyDescription>You don't have any books on your bookshelf yet.</EmptyDescription>
								) : (
									<EmptyDescription>{user.username} doesn't have any books yet on his bookshelf.</EmptyDescription>
								)}
							</EmptyHeader>
						</Empty>
					)}
				</div>
			</ProfileLayout>
		</>
	)
}

ProfilePage.layout = (page: React.ReactNode) => <BaseLayout hideHeader={true} hideMobileNav={true}>{page}</BaseLayout>
