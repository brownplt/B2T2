import { makeTester } from "./unitTest";

/// [cite https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript]
type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends ((...a: infer X) => void) ? X : never;
type GrowToSize<T, A extends Array<T>, N extends number> = { 0: A, 1: GrowToSize<T, Grow<T, A>, N> }[A['length'] extends N ? 0 : 1];
export type Vec<T, N extends number> = Array<T> & { length: N } & GrowToSize<T, [], N>;  // the first two conjuntive types are added to help type inference

const T = makeTester()

export const map = <X, Y, N extends number>(xs: Vec<X, N>, f: (x: X, i: number) => Y): Vec<Y, N> => {
	return (xs as Array<X>).map(f) as Vec<Y, N>
}

T.assertEqual(
	'map 1',
	() => map([2, 3, 4] as Vec<number, 3>, (n) => (n + 1)),
	[3, 4, 5])

export const concat = <X, N1 extends number, N2 extends number>(v1: Vec<X, N1>, v2: Vec<X, N2>): Vec<X, number> => {
	// I don't know why setting the output type to be Vec<X, [...Vec<X, N1>, ...Vec<X, N2>]['length']> doesn't work.
	return [...v1, ...v2] as Vec<X, [...Vec<X, N1>,  Vec<X, N2>]['length']>
}

T.assertEqual(
	'concat 1',
	() => concat([1, 2] as Vec<number, 2>, [3, 4, 5] as Vec<number, 3>),
	[1, 2, 3, 4, 5]
)

T.go()