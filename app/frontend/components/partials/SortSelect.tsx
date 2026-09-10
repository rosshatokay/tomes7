import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { router } from "@inertiajs/core"

interface Props {
	endpoint: string
	currentSort?: string
	sortItems: { label: string, value: string }[]
}

export default function SortSelect({ endpoint, currentSort = "most-recent", sortItems }: Props) {
	const handleValueChange = (value: string | null) => {
		router.get(endpoint, { sort: value }, {
			preserveState: true,
			preserveScroll: true,
			replace: true
		})
	}

	return (
		<Select items={sortItems} defaultValue={currentSort} onValueChange={handleValueChange}>
			<SelectTrigger>
				<SelectValue placeholder="Select" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{sortItems.map(item => (
						<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}