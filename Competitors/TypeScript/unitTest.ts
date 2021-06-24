export const makeTester = () => {
	const myEqual = (apple: any, orange: any) => {
		if (typeof apple !== typeof orange) {
			return false;
		}
		if (typeof apple !== 'object') {
			return apple === orange
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
			return `${JSON.stringify(apple)} cannot be equal to ${JSON.stringify(orange)}`;
		}
		if (typeof apple !== 'object') {
			if (apple === orange) {
				return '';
			} else {
				return `${JSON.stringify(apple)} cannot be equal to ${JSON.stringify(orange)}`;
			}
		}
		if (Object.keys(apple).length !== Object.keys(orange).length) {
			return `${JSON.stringify(apple)} cannot be equal to ${JSON.stringify(orange)}`;
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
	const assertEqual = (name: string, makeApple: () => any, orange: any) => {
		todos.push(() => {
			// try {
			// 	const apple = makeApple();
			// 	assertBoolean(myEqual(apple, orange), `${name}: ${JSON.stringify(apple)} is not equal to ${JSON.stringify(orange)}.`)
			// } catch (e) {
			// 	errors.push(`${name}: error ${JSON.stringify(e)}`)
			// }
			try {
				const apple = makeApple();
				const diff = myDiff(apple, orange);
				assertBoolean(!diff, `${name}: ${diff}.`)
			} catch (e) {
				errors.push(`${name}: error ${JSON.stringify(e)}`)
			}
		})
	}
	const go = () => {
		console.log('BEGIN')
		for (const thunk of todos) {
			thunk()
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
		assertEqual, go
	}
}