import BaseLayout from "@/layouts/BaseLayout";
import { Head } from "@inertiajs/react";

export default function LoginPage() {
	return (
		<>
			<Head>
				<title>Log in</title>
				<meta name="description" content="Log in to your Tomes account."></meta>
			</Head>
			<div>hey</div>
		</>
	)
}

LoginPage.layout = (page: React.ReactNode) => <BaseLayout hideHeader={true} hideFooter={true}>{page}</BaseLayout>