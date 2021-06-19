"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
const unitTest_1 = require("./unitTest");
const T = unitTest_1.makeTester();
const map = (xs, f) => {
    return xs.map(f);
};
exports.map = map;
T.assertEqual('map 1', () => exports.map([2, 3, 4], (n) => (n + 1)), [3, 4, 5]);
T.go();
