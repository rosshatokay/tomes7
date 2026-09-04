import Rating from "@/interfaces/ratings";
import { ProfileProps } from "./Show";
import { Fragment } from "react/jsx-runtime";
import MainBreadcrumbs from "@/components/partials/MainBreadcrumbs";
import ProfileLayout from "./ProfileLayout";
import BaseLayout from "@/layouts/BaseLayout";

interface Props extends ProfileProps {
	reviews: Rating[]
}

export default function UserReviewsPage({ user, reviews }: Props) {
	const crumbs = [
		{ label: "Home", path: "/" },
		{ label: user.username, path: `/@${user.username}` },
		{ label: "Reviews", path: `/@${user.username}/reviews` }
	]

	return (
		<Fragment>
			<MainBreadcrumbs breadcrumbs={crumbs} />
			<ProfileLayout user={user}>
				asd
			</ProfileLayout>
		</Fragment>
	)
}

UserReviewsPage.layout = (page: React.ReactNode) => <BaseLayout hideHeader={true} hideMobileNav={true}>{page}</BaseLayout>
