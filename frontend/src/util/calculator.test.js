// Unit tests for calculator.js
import { add, subtract, multiply, divide } from './calculator';

describe("Calculator utility functions", () => {
    test("add() should return the sum of two numbers", () => {
        expect(add(2, 3)).toBe(5);
        expect(add(-2, 3)).toBe(1);
        expect(add(0, 0)).toBe(0);
    });

    test("subtract() should return the difference of two numbers", () => {
        expect(subtract(5, 3)).toBe(2);
        expect(subtract(3, 5)).toBe(-2);
        expect(subtract(0, 0)).toBe(0);
    });

    test("multiply() should return the product of two numbers", () => {
        expect(multiply(2, 3)).toBe(6);
        expect(multiply(-2, 3)).toBe(-6);
        expect(multiply(0, 5)).toBe(0);
    });

    test("divide() should return the quotient of two numbers", () => {
        expect(divide(6, 3)).toBe(2);
        expect(divide(-6, 3)).toBe(-2);
        expect(divide(0, 5)).toBe(0);
    });

    test("divide() should throw an error when dividing by zero", () => {
        expect(() => divide(6, 0)).toThrow("Division by zero is not allowed.");
        expect(() => divide(0, 0)).toThrow("Division by zero is not allowed.");
    });
});