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

export const removeDuplicates = <X>(xs: Array<X>): Array<X> => {
	const ys: Array<X> = [];
	for (const x of xs) {
		if (!ys.includes(x)) {
			ys.push(x)
		}
	}
	return ys;
}

export const map = <X, Y>(xs: Array<X>, f: (x: X) => Y): Array<Y> => {
	return xs.map(f)
}

export const range = (n: number) => {
	return Array.from(Array(n).keys())
}

export const sample = <X>(xs: Array<X>, n: number) => {
	const chosen: Set<number> = new Set()
	const result: Array<X> = []
	for (; n > 0; n--) {
		let i: number;
		while (true) {
			i = Math.floor(Math.random() * xs.length)
			if (!chosen.has(i)) {
				chosen.add(i)
				break
			}
		}
		result.push(xs[i])
	}
	return result
}

export const fisherTest = (xs: Array<boolean>, ys: Array<boolean>) => {
	const contigencyTable = [
		[0, 0],
		[0, 0],
	]
	const b2i = (b: boolean) => {
		return b ? 1 : 0
	}
	for (let i = 0; i < xs.length; i++) {
		contigencyTable[b2i(xs[i])][b2i(ys[i])]++
	}

	const factorial = (n: number): number => {
		if (n === 0) {
			return 1
		} else {
			return n * factorial(n - 1)
		}
	}
	const [[a, b], [c, d]] = contigencyTable
	const p = (factorial(a + b) * factorial(c + d) * factorial(a + c) * factorial(b + d)) / (factorial(a) * factorial(b) * factorial(c) * factorial(d) * factorial(a + b + c + d))
	return p
}


export const startsWith = (s: string, prefix: string) => {
	return s.startsWith(prefix)
}

export const colNameOfNumber = (n: number) => {
	return n + ""
}