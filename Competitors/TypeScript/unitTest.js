"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTester = void 0;
const makeTester = () => {
    const myEqual = (apple, orange) => {
        if (typeof apple !== typeof orange) {
            return false;
        }
        if (typeof apple !== 'object') {
            return apple === orange;
        }
        if (Object.keys(apple).length !== Object.keys(orange).length) {
            return false;
        }
        for (const key of Object.keys(apple)) {
            if (!myEqual(apple[key], orange[key])) {
                return false;
            }
        }
        return true;
    };
    const todos = [];
    let successCount = 0;
    const errors = [];
    const assertBoolean = (bool, msg) => {
        if (!bool) {
            errors.push(msg);
        }
        else {
            successCount++;
        }
    };
    const assertEqual = (name, makeApple, orange) => {
        todos.push(() => {
            try {
                const apple = makeApple();
                assertBoolean(myEqual(apple, orange), `${name}: ${JSON.stringify(apple)} is not equal to ${JSON.stringify(orange)}.`);
            }
            catch (e) {
                errors.push(`${name}: error ${JSON.stringify(e)}`);
            }
        });
    };
    const go = () => {
        for (const thunk of todos) {
            thunk();
        }
        for (const e of errors) {
            console.log(e);
        }
        console.log('--- SUMMARY ---');
        console.log(`succeess: ${successCount}`);
        console.log(`failure:  ${errors.length}`);
    };
    return {
        assertEqual, go
    };
};
exports.makeTester = makeTester;
