// LESSON 3: Handling OK and Err Cases
// This lesson demonstrates how to properly handle both success and error cases
// using the Result type's isOk() and isErr() methods

import { err, ok, Result } from "neverthrow"
import { expect, it, vitest } from "vitest"

/**
 * Our JSON parser from previous lessons
 * Returns a Result that will be either:
 * - ok() with the parsed JSON data
 * - err() with a SyntaxError
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
 * Example HTTP request handler that uses the Result pattern
 *
 * This function demonstrates the proper way to handle both success and error cases:
 * 1. We don't need try/catch blocks when using Results
 * 2. We can use conditional checks (isOk/isErr) to handle each case
 * 3. TypeScript ensures we handle both cases
 * 4. The compiler ensures we only access .value on success and .error on failure
 */
const handleRequest = (
    req: {
        body: string
    },
    res: (status: number, message: string) => void,
) => {
    // Parse the request body, which may succeed or fail
    const result = jsonParse(req.body)

    // Handle the success case (OK path)
    if (result.isOk()) {
        // TypeScript knows result.value is available here
        // We can safely return a 200 OK with the ID from the parsed JSON
        res(200, result.value.id)
    } else {
        // Handle the error case (Err path)
        // TypeScript knows result.error is available here
        // We can safely return a 400 Bad Request with the error message
        res(400, result.error.message)
    }

    // Note: TypeScript would complain if we tried to access result.value or
    // result.error without the appropriate guards, preventing runtime errors
}

// TESTS: Verify the success case
it("Should return the id if the JSON is valid", () => {
    const resSpy = vitest.fn()

    handleRequest({ body: '{"id": "123"}' }, resSpy)

    expect(resSpy).toHaveBeenCalledWith(200, "123")
})

// TESTS: Verify the error case
it("Should return the error message if the JSON is invalid", () => {
    const resSpy = vitest.fn()

    handleRequest({ body: "invalid json" }, resSpy)

    expect(resSpy).toHaveBeenCalledWith(
        400,
        "Unexpected token 'i', \"invalid json\" is not valid JSON",
    )
})
