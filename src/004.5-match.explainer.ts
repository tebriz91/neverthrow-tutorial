// LESSON 4.5: The match() Method - Handling Both Cases in One Call
// This lesson introduces the match() method, which provides a more
// functional programming approach to handling both cases at once

import { err, ok, Result } from "neverthrow"
import { expect, it, vitest } from "vitest"

/**
 * Our familiar JSON parser
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
 * HTTP request handler using the match() method
 *
 * match() is the most concise way to handle both success and error cases:
 * - Takes two functions as arguments: onSuccess and onError
 * - Guarantees that exactly one of them will be called
 * - Has better ergonomics than using both map() and mapErr()
 * - Perfect for when you need to handle both cases in one place
 *
 * Format:
 * result.match(
 *   (successValue) => { // handle success },
 *   (errorValue) => { // handle error }
 * )
 */
const handleRequest = (
    req: {
        body: string
    },
    res: (status: number, message: string) => void,
) => {
    jsonParse(req.body).match(
        // First function: called when Result is ok (success case)
        // Receives the success value (parsed JSON data)
        (data) => {
            res(200, data.id)
        },
        // Second function: called when Result is err (error case)
        // Receives the error value (SyntaxError)
        (err) => {
            res(400, err.message)
        },
    )

    // Benefits over previous approaches:
    // 1. Both cases are grouped together in one method call
    // 2. More declarative, showing the two possible outcomes side by side
    // 3. Forces you to handle both cases (no forgetting error handling)
    // 4. Returns a value - can be used in expressions (not shown in this example)
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
