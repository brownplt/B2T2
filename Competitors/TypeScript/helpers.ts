export const removeAll = <X>(a: Array<X>, b: Array<X>): Array<X> => {
	return a.filter((x) => {
		return !b.includes(x)
	})
}

export const even = (n: number) => {
	return n === Math.floor(n / 2) * 2
}

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

export const concatArray = <X>(xs1: Array<X>, xs2: Array<X>) => {
	return [...xs1, ...xs2]
}

export const removeDuplicates = <X>(xs: Array<X>): Array<X> => {
	const ys: Array<X> = [];
	for (const x of xs) {
		if (! ys.includes(x)) {
			ys.push(x)
		}
	}
	return ys;
}

export const map = <X, Y>(xs: Array<X>, f: (x: X) => Y): Array<Y> => {
	return xs.map(f)
}