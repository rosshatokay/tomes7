export const calculatePercentChange = (current: number, previous: number): number => {
	if (previous === 0 && current > 0) return 100
	if (previous === 0) return 0

	return ((current - previous) / Math.abs(previous)) * 100
}

export const percentChangeColor = (change: number): string => {
	// if (change > 0) {
	// 	return "text-green-800 dark:text-green-300"
	// }
	if (change < 0) {
		return "text-red-800 dark:text-red-300"
	}

	return "text-neutral-800 dark:text-neutral-400"
}