// LESSON 6: Why Explicit Result Type Annotations Are Needed
// This lesson explains why it's important to add explicit Result<T, E> type annotations
// to your functions, even though they could be inferred

import { err, ok, Result } from "neverthrow"
import { expect, it, vitest } from "vitest"

/**
 * JSON parser WITHOUT explicit Result type annotation
 *
 * PROBLEM: Without the explicit Result<any, SyntaxError> type,
 * TypeScript will infer a less specific type:
 * - Return type will be inferred as Result<any, unknown> or similar
 * - Error type is too general (unknown instead of SyntaxError)
 * - This loses the precise error type information
 */
const jsonParse = (input: string): Result<any, SyntaxError> => {
    try {
        return ok(JSON.parse(input))
    } catch (error) {
        if (error instanceof SyntaxError) {
            return err(error)
        }
        throw error
    }
}

/**
 * Validation function WITHOUT explicit Result type annotation
 *
 * PROBLEM: Again, without the explicit Result<{id: string}, Error> type,
 * TypeScript loses information about:
 * - What success value shape to expect (just 'any' with an id property)
 * - What error type to expect (just some Error)
 */
const checkForId = (data: any): Result<any, Error> => {
    if (!data.id) {
        return err(new Error("No id found"))
    }

    return ok(data)
}

/**
 * Request handler using functions without explicit Result types
 *
 * BENEFITS OF ADDING EXPLICIT RESULT TYPES (that we're missing here):
 *
 * 1. Documentation:
 *    - Makes it clear what success/error values a function can return
 *    - Helps other developers understand your code's contract
 *
 * 2. Type Safety:
 *    - Catches errors if you try to return the wrong type
 *    - Prevents accidentally returning err() with a type that doesn't match
 *
 * 3. Better Intellisense:
 *    - More precise autocompletion for success and error values
 *    - Clearer error messages when types don't match
 *
 * 4. API Contracts:
 *    - Creates a clear contract for what your function will return
 *    - Makes refactoring safer by ensuring type compatibility
 */
const handleRequest = (
    req: {
        body: string
    },
    res: (status: number, message: string) => void,
) => {
    // Even though this works functionally, we're missing type safety
    // Compare with the version in lesson 5 where explicit types made
    // the error types more precise and the code more self-documenting
    jsonParse(req.body)
        .andThen(checkForId)
        .map((data: any) => {
            res(200, data.id)
        })
        .mapErr((err: Error | SyntaxError) => {
            // Here TypeScript doesn't know what specific error type we have
            // It could be a SyntaxError or a "No id found" Error
            // With explicit types, we'd have better type information
            res(400, err.message)
        })
}

// TESTS: These still work the same since runtime behavior is unchanged
// But without explicit types, we've lost compile-time safety

// TESTS: Verify the success case
it("Should return the id if the JSON is valid", () => {
    const resSpy = vitest.fn()

    handleRequest({ body: '{"id": "123"}' }, resSpy)

    expect(resSpy).toHaveBeenCalledWith(200, "123")
})

// TESTS: Verify validation error case (valid JSON but no ID)
it("Should error if you do not pass an id", () => {
    const resSpy = vitest.fn()

    handleRequest({ body: "{}" }, resSpy)

    expect(resSpy).toHaveBeenCalledWith(400, "No id found")
})

// TESTS: Verify parsing error case (invalid JSON)
it("Should return the error message if the JSON is invalid", () => {
    const resSpy = vitest.fn()

    handleRequest({ body: "invalid json" }, resSpy)

    expect(resSpy).toHaveBeenCalledWith(
        400,
        "Unexpected token 'i', \"invalid json\" is not valid JSON",
    )
})
