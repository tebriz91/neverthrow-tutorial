// LESSON 1.2: Adding Explicit Type Annotations to Results
// This lesson builds on the basics by introducing explicit type parameters
// to create a stronger contract for your functions

// Import the Result type and its constructor functions from neverthrow
// - Result<T, E> is the main type that represents either success (T) or failure (E)
// - ok() wraps successful values
// - err() wraps error values
import { err, ok, Result } from "neverthrow"
import { expect, it } from "vitest"
import { Expect, Equal } from "@total-typescript/helpers"

/**
 * A JSON parser that returns a Result with explicit type parameters
 *
 * Key improvements over the previous version:
 * 1. The function signature explicitly states what types it returns
 * 2. The Result<any, SyntaxError> type creates a contract:
 *    - Success cases will always contain parsed JSON (any type)
 *    - Error cases will always contain a SyntaxError
 * 3. This helps catch bugs at compile-time rather than runtime
 * 4. It makes the function's behavior more predictable and self-documenting
 */
const jsonParse = (input: string): Result<any, SyntaxError> => {
    try {
        // If parsing succeeds, wrap the parsed value in an ok() Result
        // This converts the value into a Result that signals success
        return ok(JSON.parse(input))
    } catch (error) {
        // If parsing fails, we need to handle the error appropriately
        if (error instanceof SyntaxError) {
            // If it's a SyntaxError, wrap it in an err() Result
            // This converts the error into a Result that signals failure
            return err(error)
        }
        // If it's some other type of error, we rethrow it
        // This maintains the contract that we only return SyntaxError in the error case
        throw error
    }
}

// TESTS: Verify the success case
it("Should parse JSON", () => {
    const result = jsonParse('{"key": "value"}')

    expect(result.isOk()).toBe(true)

    if (!result.isOk()) return

    expect(result.value).toEqual({ key: "value" })

    type Test = Expect<Equal<typeof result.value, any>>
})

// TESTS: Verify the error case
it("Should return an error if the JSON is invalid", () => {
    const result = jsonParse("invalid json")

    expect(result.isErr()).toBe(true)

    if (!result.isErr()) return

    expect(result.error).toBeInstanceOf(SyntaxError)

    type Test = Expect<Equal<typeof result.error, SyntaxError>>
})
