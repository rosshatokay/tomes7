import BaseLayout from "@/layouts/BaseLayout"
import { marked } from "marked"

interface Props {
	raw_article: string
}

export default function ArticlePage(props: Props) {
	const parsed = marked.parse(props.raw_article)

	return (
		<article className="small-container pt-12 md:pb-0 pb-12">
			<div dangerouslySetInnerHTML={{ __html: parsed }}></div>
		</article>
	)
}

ArticlePage.layout = (page: React.ReactNode) => <BaseLayout forceFooterForMobile={true}>{page}</BaseLayout>