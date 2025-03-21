// LESSON 3 (ALTERNATIVE): Handling Err First, Then OK
// This lesson shows an alternative approach where we check for errors first
// This is a common pattern in error handling called "early return"

import { err, ok, Result } from "neverthrow"
import { expect, it, vitest } from "vitest"

/**
 * Our JSON parser returning a Result type
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
 * Example HTTP request handler using the "check for errors first" pattern
 *
 * Benefits of the error-first approach:
 * 1. It follows the "early return" pattern - handle errors early and return
 * 2. This often leads to cleaner code with less nesting
 * 3. The happy path comes last, making the main flow clearer
 * 4. This mimics how many developers naturally handle errors in other contexts
 */
const handleRequest = (
    req: {
        body: string
    },
    res: (status: number, message: string) => void,
) => {
    const result = jsonParse(req.body)

    // Handle the error case first (early return pattern)
    if (result.isErr()) {
        // We know for sure that result.error is available here
        res(400, result.error.message)
        return // Often with early returns, you would return here
        // (though in this example it's not strictly necessary)
    } else {
        // If we get here, we know it's success
        // TypeScript knows result.value is available here
        res(200, result.value.id)
    }

    // Note: The behavior is identical to the previous example,
    // just structured differently with errors handled first
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
