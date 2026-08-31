import { marked } from "marked"

interface Props {
	raw_article: string
}

export default function ArticlePage(props: Props) {
	const parsed = marked.parse(props.raw_article)

	return (
		<article className="small-container pt-12">
			<div dangerouslySetInnerHTML={{ __html: parsed }}></div>
		</article>
	)
}