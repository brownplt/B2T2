export const le = (n1: number, n2: number) => {
	return n1 <= n2
}

export const ge = (n1: number, n2: number) => {
	return n1 >= n2
}

export const average = (ns: Array<number>) => {
	let sum = 0;
	for (const n of ns) {
		sum += n;
	}
	return sum / ns.length;
}