export const makeTester = () => {
	const myEqual = (apple: any, orange: any) => {
		if (typeof apple !== typeof orange) {
			return false;
		}
		if (typeof apple !== 'object') {
			return apple === orange
		}
		if (apple === null) {
			return orange === null;
		}
		if (Object.keys(apple).length !== Object.keys(orange).length) {
			return false
		}
		for (const key of Object.keys(apple)) {
			if (!myEqual(apple[key], orange[key])) {
				return false
			}
		}
		return true;
	}
	const myDiff = (apple: any, orange: any): string => {
		if (typeof apple !== typeof orange) {
			return `${JSON.stringify(apple, null, 4)} cannot be equal to ${JSON.stringify(orange, null, 4)}`;
		}
		if (typeof apple !== 'object') {
			if (apple === orange) {
				return '';
			} else {
				return `${JSON.stringify(apple, null, 4)} cannot be equal to ${JSON.stringify(orange, null, 4)}`;
			}
		}
		if (apple === null && orange === null) {
			return '';
		}
		if (apple === null || orange === null) {
			return `${JSON.stringify(apple, null, 4)} cannot be equal to ${JSON.stringify(orange, null, 4)}`;
		}
		if (Object.keys(apple).length !== Object.keys(orange).length) {
			return `${JSON.stringify(apple, null, 4)} cannot be equal to ${JSON.stringify(orange, null, 4)}`;
		}
		for (const key of Object.keys(apple)) {
			const diff = myDiff(apple[key], orange[key])
			if (diff) {
				return diff
			}
		}
		return '';
	}
	const todos: Array<() => void> = [];
	let successCount = 0;
	const errors: string[] = [];
	const assertBoolean = (bool: boolean, msg: string) => {
		if (!bool) {
			errors.push(msg)
		} else {
			successCount++;
		}
	}
	const assertThrow = (name: string, makeApple: () => any, orange: any) => {
		todos.push(() => {
			let value;
			for (const _ of [1]) {
				try {
					value = makeApple();
					break;
				} catch (apple) {
					const diff = myDiff(apple, orange);
					assertBoolean(!diff, `${name}: ${diff}.\n${JSON.stringify(apple, null, 4)}\n${JSON.stringify(orange, null, 4)}`)
					return
				}
			}
			throw `expecting error, received ${value}`
		})
	}
	const assertEqual = (name: string, makeApple: () => any, orange: any) => {
		todos.push(() => {
			try {
				const apple = makeApple();
				const diff = myDiff(apple, orange);
				assertBoolean(!diff, `${name}: ${diff}.\n${JSON.stringify(apple, null, 4)}\n${JSON.stringify(orange, null, 4)}`)
			} catch (e) {
				throw e;
			}
		})
	}
	const go = () => {
		console.log('BEGIN')
		for (const thunk of todos) {
			try {
				thunk()
			} catch (e) {
				errors.push(`Caught exception: ${e}`)
			}
		}
		for (const e of errors) {
			console.log(e)
		}
		console.log('--- SUMMARY ---')
		console.log(`passed: ${successCount}`)
		console.log(`failed: ${errors.length}`)
		console.log('END')
	}
	return {
		assertEqual, assertThrow, go
	}
}