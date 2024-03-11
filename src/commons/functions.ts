export const to2sigFigures = (num: number): number => {
	if (Number.isInteger(num)) {
		return num
	} else {
		return Number(num.toFixed(2))
	}
}