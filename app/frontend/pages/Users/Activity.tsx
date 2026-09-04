import MainBreadcrumbs from "@/components/partials/MainBreadcrumbs";
import ProfileLayout from "./ProfileLayout";
import { ProfileProps } from "./Show";
import { Fragment } from "react/jsx-runtime";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InfoIcon } from "lucide-react";
import ActivityCard from "@/components/partials/cards/ActivityCard";
import BaseLayout from "@/layouts/BaseLayout";

interface Props extends ProfileProps {
	activities: []
}

export default function UserActivityPage({ user, activities }: Props) {
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: user.username, path: `/@${user.username}` },
		{ label: "Activity", path: `/@${user.username}/activity` }
	]

	return (
		<Fragment>
			<MainBreadcrumbs breadcrumbs={crumbs} />
			<ProfileLayout user={user}>
				{activities?.length > 0 && (
					<div>
						{activities.map((item, index) => (
							<ActivityCard key={index} activity={item} />
						))}
					</div>
				)}
				{activities?.length === 0 && (
					<Empty className="border">
						<EmptyHeader>
							<EmptyMedia variant={"icon"}><InfoIcon /></EmptyMedia>
							<EmptyTitle>Nothing here</EmptyTitle>
							{user.is_current ? (
								<EmptyDescription>You don't have any activities to show yet.</EmptyDescription>
							) : (
								<EmptyDescription>{user.username} doesn't have any activities to show yet.</EmptyDescription>
							)}
						</EmptyHeader>
					</Empty>
				)}
			</ProfileLayout>
		</Fragment >
	)
}

UserActivityPage.layout = (page: React.ReactNode) => <BaseLayout hideHeader={true} hideMobileNav={true}>{page}</BaseLayout>

