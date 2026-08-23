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
			<div className="max-w-3xl w-full mx-auto flex flex-col gap-12 py-12">
				<div>
					<div className="text-sm text-subtle">{strftime("%b %d, %A, %Y", new Date())}</div>
					<div className="font-medium text-xl">Stats overview</div>
					<div className="mt-6 grid grid-cols-3 gap-4">
						{props.charts.overview.map((ch, i) => {
							const percChange = calculatePercentChange(ch.current, ch.previous)
							const perChangeColor = percentChangeColor(percChange)

							return (
								<div className="border p-5 rounded-xl" key={i}>
									<div className="font-medium">{ch.label}</div>
									<div className="text-subtle text-sm">{ch.period_label}</div>
									<div className="pt-6 flex flex-col">
										<div className="text-2xl">{ch.current}</div>
										<span className="text-sm text-subtle">
											<span className={perChangeColor}>{`${percChange < 0 ? '-' : '+'}${percChange}`}%</span>
											<span> vs last period</span>
										</span>
									</div>
								</div>
							)
						})}
					</div>
					<div className="border p-5 rounded-xl mt-4">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-2 rounded-[2px] aspect-square bg-foreground"></div>
							<div className="font-medium">Registrations over time</div>
						</div>
						<div>
							<ChartContainer className="w-full h-[320px]" config={chartConfig}>
								<BarChart accessibilityLayer data={formattedRegistrations} height={40}>
									<CartesianGrid vertical={false}></CartesianGrid>
									<Bar
										dataKey="registrations"
										fill="var(--color-foreground)"
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
				</div>
			</div>
		</>
	)
}

Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>