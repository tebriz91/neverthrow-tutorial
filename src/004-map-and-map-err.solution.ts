// LESSON 4: Transforming Results with map() and mapErr()
// This lesson introduces methods to transform success and error values
// without having to manually check isOk() or isErr()

import { err, ok, Result } from "neverthrow"
import { expect, it, vitest } from "vitest"

/**
 * Our familiar JSON parser returning a Result
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
 * HTTP request handler using Result's transformation methods
 *
 * Instead of manually checking isOk() and isErr(), we can use:
 * - map(): Transforms the success value (runs only if Result is ok)
 * - mapErr(): Transforms the error value (runs only if Result is err)
 *
 * Benefits:
 * - More declarative approach - we define transformations for each path
 * - Chaining operations is cleaner and easier to read
 * - No explicit conditional checks needed
 * - Type safety is still preserved
 */
const handleRequest = (
    req: {
        body: string
    },
    res: (status: number, message: string) => void,
) => {
    jsonParse(req.body)
        // .map() only runs if the Result is ok (success case)
        // It receives the success value (the parsed JSON)
        .map((data) => {
            res(200, data.id)
        })
        // .mapErr() only runs if the Result is err (error case)
        // It receives the error value (the SyntaxError)
        .mapErr((err) => {
            res(400, err.message)
        })

    // Note: Only one of these functions will run, depending on
    // whether the Result is ok or err. It's like an if/else,
    // but with a more functional programming style.
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
