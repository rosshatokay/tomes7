import { calculatePercentChange, percentChangeColor } from "@/utils/calculatePercentChange"
import AdminLayout from "../../layouts/AdminLayout"
import strftime from "strftime"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Deferred } from "@inertiajs/react"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface DashboardProps {
	auth: {
		admin: { email: string }
	}
	charts: {
		overview: [
			{ label: string, period_label: string, current: number, previous: number }
		],
		registrations: [{ month: string, registrations: number }]
	},
	most_read_books: [{ title: string, author_names: string, cover: string, readers_count: number }]
}

const chartConfig = {
	registrations: {
		label: "Sign ups",
		color: "#2563eb",
	}
} satisfies ChartConfig

const nilValBarShape = (props: any) => {
	const { x, y, width, height, fill } = props;
	const minHeight = 4; // Minimum height in pixels

	// If the calculated height is smaller than minHeight, adjust height and y position
	const actualHeight = Math.max(height, minHeight);
	const actualY = height < minHeight ? y - (minHeight - height) : y;

	return (
		<rect
			x={x}
			y={actualY}
			width={width}
			height={actualHeight}
			fill={fill}
			rx={4}
		/>
	);
}


export default function Dashboard(props: DashboardProps) {
	const formattedRegistrations = props.charts.registrations.map(item => ({
		...item,
		displayRegistrations: item.registrations === 0 ? 1 : item.registrations
	}))

	return (
		<>
			<div className="max-w-5xl w-full mx-auto flex flex-col gap-12">
				<div>
					<div className="text-neutral-400">{strftime("%b %d, %A, %Y", new Date())}</div>
					<div className="font-medium text-3xl">Stats overview</div>
					<div className="mt-6 grid grid-cols-3 gap-4">
						{props.charts.overview.map((ch, i) => {
							const percChange = calculatePercentChange(ch.current, ch.previous)
							const perChangeColor = percentChangeColor(percChange)

							return (
								<div className="bg-surface p-5 rounded-2xl" key={i}>
									<div className="text-lg font-medium">{ch.label}</div>
									<div className="text-neutral-400">{ch.period_label}</div>
									<div className="pt-6 flex flex-col">
										<div className="text-3xl">{ch.current}</div>
										<span className="text-sm text-neutral-800 dark:text-neutral-400">
											<span className={perChangeColor}>{`${percChange < 0 ? '-' : '+'}${percChange}`}%</span>
											<span> vs last period</span>
										</span>
									</div>
								</div>
							)
						})}
					</div>
					<div className="bg-surface p-5 rounded-2xl mt-4">
						<div className="text-lg">Registrations over time</div>
						<div>
							<ChartContainer className="w-full h-[320px]" config={chartConfig}>
								<BarChart accessibilityLayer data={formattedRegistrations} height={40}>
									<CartesianGrid vertical={false}></CartesianGrid>
									<Bar
										dataKey="registrations"
										fill="#ffffff"
										radius={4}
										shape={(props: any) => nilValBarShape(props)}
									/>
									<XAxis
										dataKey="month"
										axisLine={false}
										tickLine={false}
										tickMargin={10}
										tickFormatter={(value) => value.slice(0, 3)}
									/>
									<ChartTooltip content={<ChartTooltipContent />}></ChartTooltip>
								</BarChart>
							</ChartContainer>
						</div>
					</div>
					<div className="mt-12">
						<div className="text-2xl font-medium mb-6">Most read books</div>
						<Deferred data="most_read_books" fallback={<div className="flex-center"><Spinner className="size-8"></Spinner></div>}>
							<Table>
								<TableCaption>A list of most read books.</TableCaption>
								<TableHeader>
									<TableRow className="border-none">
										<TableHead className="text-neutral-400 text-base min-w-[400px]">Book</TableHead>
										<TableHead className="text-neutral-400 text-base min-w-[200px]">Readers</TableHead>
										<TableHead className="text-neutral-400 text-base"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{props.most_read_books?.map((book, i) => (
										<TableRow key={i}>
											<TableCell className="flex items-center gap-4 min-w-px">
												<div className="w-12 rounded-lg aspect-book bg-surface" style={{background: `url(${book.cover}) center / cover`}}></div>
												<div>
													<div className="font-normal text-base">{book.title}</div>
													<div className="text-neutral-400">{book.author_names}</div>
												</div>
											</TableCell>
											<TableCell className="text-base">{book.readers_count}</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><i className="ph ph-dots-three text-xl"></i></Button>}></DropdownMenuTrigger>
													<DropdownMenuContent side="bottom" align="end">
														<DropdownMenuItem>View</DropdownMenuItem>
														<DropdownMenuItem>Share</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Deferred>
					</div>
				</div>
			</div>
		</>
	)
}

Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>