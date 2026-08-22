import { Combobox, ComboboxChip, ComboboxChips, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";
import { useHttp } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { Fragment, useEffect, useState } from "react";

type Category = {
  name: string
  id: number
}

export function CategoryComboBox() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const { get, processing } = useHttp({})

  useEffect(() => {
    get("/api/v1/admins/categories", {
      onSuccess: (res: any) => setCategories(res.categories)
    })
  }, [])

  return (
    <Combobox
      items={categories}
      value={selectedCategory}
      onValueChange={(value) => setSelectedCategory(value)}
      itemToStringLabel={(category: Category) => category?.name ?? ""}
      itemToStringValue={(category: Category) => category ? String(category.id) : ""}
    >
      <ComboboxInput placeholder="Select a category" />
      <ComboboxContent>
        <ComboboxEmpty>
          {processing ? "Searching..." : "No items found."}
        </ComboboxEmpty>
        <ComboboxList>
          {(category) => (
            <ComboboxItem key={category.id} value={category}>
              {category.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

// export function CategoryComboBox() {
// 	const [categories, setCategories] = useState<Category[]>([])
// 	const [searchQuery, setSearchQuery] = useState<string>("")
// 	const [activeCategory, setActiveCategory] = useState<Category | null>(null)
// 	const { get, processing } = useHttp({})

// 	const debouncedSearchQuery = useDebounce(searchQuery, 300)

// 	useEffect(() => {
// 		if (debouncedSearchQuery.trim() === "") {
// 			setCategories([])
// 			return
// 		}

// 		get(`/api/v1/admins/categories/search?q=${encodeURIComponent(debouncedSearchQuery)}`, {
// 			onSuccess: (res: any) => {
// 				console.log(res.results)
// 				setCategories(res.results as Category[])
// 			}
// 		})
// 	}, [debouncedSearchQuery])

// 	return (
// 		<Combobox
// 			items={categories}
// 			itemToStringValue={(category: Category) => category.name}
// 			onValueChange={(category) => {
// 				if (category) {
// 					setSearchQuery(category.name)
// 				}
// 			}}
// 		>
// 			<ComboboxInput
// 				placeholder="Select a category"
// 				onChange={(e) => setSearchQuery(e.target.value)}
// 				value={searchQuery}
// 			/>
// 			<ComboboxContent>
// 				<ComboboxEmpty>
// 					{processing ? "Searching..." : "No items found."}
// 				</ComboboxEmpty>
// 				<ComboboxList>
// 					{(category) => (
// 						<ComboboxItem key={category.id} value={category}>
// 							{category.name}
// 						</ComboboxItem>
// 					)}
// 				</ComboboxList>
// 			</ComboboxContent>
// 		</Combobox>
// 	)
// }