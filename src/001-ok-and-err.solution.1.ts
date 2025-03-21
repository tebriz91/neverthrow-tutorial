// LESSON 1: Introduction to neverthrow's Result Type
// This lesson introduces the fundamental building blocks of the neverthrow library:
// - The Result type that represents either success or failure
// - The ok() and err() functions to create Result instances

// Import the ok and err functions from neverthrow
// - ok() wraps a successful value in a Result
// - err() wraps an error value in a Result
import { err, ok } from "neverthrow"
import { expect, it } from "vitest"
import { Expect, Equal } from "@total-typescript/helpers"

/**
 * A function that safely parses JSON using the Result pattern
 *
 * Key concepts:
 * 1. Instead of throwing exceptions, we return a Result object
 * 2. Success cases are wrapped in ok()
 * 3. Expected errors are wrapped in err()
 * 4. Unexpected errors are still thrown
 */
const jsonParse = (input: string) => {
    try {
        // If parsing succeeds, wrap the parsed value in an ok() Result
        // This creates a "success" Result that contains the parsed JSON
        return ok(JSON.parse(input))
    } catch (error) {
        // If parsing fails with a SyntaxError (expected failure case)
        // Wrap the error in an err() Result to handle it gracefully
        if (error instanceof SyntaxError) {
            return err(error)
        }
        // For any other error type (unexpected failure case)
        // We re-throw it as it's likely a programming error
        throw error
    }
}

// TESTS: Verify the success case
it("Should parse JSON", () => {
    const result = jsonParse('{"key": "value"}')

    // Check if the Result is a success
    expect(result.isOk()).toBe(true)

    // Type narrowing: After checking isOk(), TypeScript knows this is a success Result
    if (!result.isOk()) return

    // Now we can safely access the .value property
    expect(result.value).toEqual({ key: "value" })

    // Type assertion test - confirms the type of result.value
    type Test = Expect<Equal<typeof result.value, any>>
})

// TESTS: Verify the error case
it("Should return an error if the JSON is invalid", () => {
    const result = jsonParse("invalid json")

    // Check if the Result is an error
    expect(result.isErr()).toBe(true)

    // Type narrowing: After checking isErr(), TypeScript knows this is an error Result
    if (!result.isErr()) return

    // Now we can safely access the .error property
    expect(result.error).toBeInstanceOf(SyntaxError)

    // Type assertion test - confirms the type of result.error
    type Test = Expect<Equal<typeof result.error, SyntaxError>>
})
