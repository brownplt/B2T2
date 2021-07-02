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

export const filter = <X>(xs: Array<X>, f: (x: X) => boolean) => {
	return xs.filter(f)
}

export const length = <X>(xs: Array<X>) => {
	return xs.length
}

export const concat = (xs1: string, xs2: string) => {
	return xs1 + xs2
}