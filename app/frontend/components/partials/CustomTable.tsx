import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Checkbox } from "../ui/checkbox"
import { ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Row {
	id: string
	[key: string]: any
}

export interface Column {
	key: string
	label: {
		icon?: ReactNode
		text: string
	}
	render?: (row: Row) => ReactNode
}

interface TableProps {
	rows: Row[]
	columns: Column[]
	onRowClick?: (row: any) => void
	onCheck?: (row: any) => void
}

export default function CustomTable({ rows = [], columns = [], onRowClick, onCheck }: TableProps) {
	const [selectedRows, setSelectedRows] = useState<Set<string>>(
		new Set([])
	)

	const selectAll = selectedRows.size === rows?.length

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedRows(new Set(rows.map((row) => row.id)))
		} else {
			setSelectedRows(new Set())
		}
	}

	const handleSelectRow = (id: string, checked: boolean) => {
		const newSelected = new Set(selectedRows)

		if (checked) {
			newSelected.add(id)
		} else {
			newSelected.delete(id)
		}

		setSelectedRows(newSelected)
	}

	useEffect(() => {
		// console.log(selectedRows)
	}, [selectedRows])

	const handleRowClick = (e: React.MouseEvent, row: Row) => {
		const isCheckbox = (e.target as HTMLElement).closest('.checkbox-cell') !== null

		if (onRowClick && !isCheckbox) onRowClick(row)
		if (onCheck && isCheckbox) onCheck(row)
	}
	
	return (
		<Table>
			<TableHeader>
				<TableRow className="hover:bg-transparent">
					<TableHead className="w-10 min-w-10 pl-4 checkbox-cell">
						<Checkbox
							className={"border-foreground/20"}
							id="select-all-checkbox"
							name="select-all-checkbox"
							checked={selectAll}
							onCheckedChange={handleSelectAll}
						/>
					</TableHead>

					{columns.map((col) => (
						<TableHead key={col.key} className="text-subtle border-r font-normal">
							<div className="flex items-center gap-1 text-subtle font-normal pl-1 pr-6">
								{col.label.icon}
								{col.label.text}
							</div>
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody className="border-b">
				{rows.map((row) => {
					const isSelected = selectedRows.has(row.id)

					return (
						<TableRow
							key={row.id}
							data-state={isSelected ? "selected" : undefined}
							onClick={(e: React.MouseEvent) => handleRowClick(e, row)}
							className="cursor-pointer"
						>
							<TableCell className="pl-4 checkbox-cell">
								<Checkbox
									className="border-foreground/20"
									checked={isSelected}
									onCheckedChange={(checked) => handleSelectRow(row.id, Boolean(checked))}
								/>
							</TableCell>

							{columns.map((col, index) => (
								<TableCell key={col.key} className={cn("whitespace-nowrap w-px border-r pl-3 pr-12", index >= columns.length - 1 ? "w-full" : "")}>
									{col.render ? col.render(row) : row[col.key]}
								</TableCell>
							)
							)}
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}