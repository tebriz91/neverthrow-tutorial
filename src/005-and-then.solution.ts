// LESSON 5: Chaining Results with andThen()
// This lesson introduces the andThen() method for composing multiple Result-returning operations
// in sequence, creating a chain of operations that fail fast on the first error

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
 * A validation function that also returns a Result
 *
 * This function:
 * - Takes the data from a successful jsonParse
 * - Checks if it has an 'id' property
 * - Returns a Result with either:
 *   - ok(): The same data if valid
 *   - err(): A new Error if invalid
 *
 * Note: This shows how we can use Result for validation, not just for error handling
 */
const checkForId = (data: any): Result<{ id: string }, Error> => {
    if (!data.id) {
        return err(new Error("No id found"))
    }

    return ok(data)
}

/**
 * HTTP request handler showing Result chaining with andThen()
 *
 * Key concepts of andThen():
 * 1. Allows chaining of Result-returning functions (like flatMap or bind in other FP languages)
 * 2. Only calls the next function if the current Result is ok
 * 3. If any operation in the chain returns err, the remaining operations are skipped
 * 4. Perfect for sequential operations where each depends on the previous success
 *
 * This is the "railway oriented programming" concept in action:
 * - Success values continue down the happy path
 * - Error values skip the remaining functions and go straight to error handling
 */
const handleRequest = (
    req: {
        body: string
    },
    res: (status: number, message: string) => void,
) => {
    jsonParse(req.body)
        // andThen() takes a function that returns a Result
        // It only runs if jsonParse succeeded (returns ok)
        // If jsonParse failed, checkForId is skipped entirely
        .andThen(checkForId)
        // After validation, continue with normal transformations
        .map((data) => {
            res(200, data.id)
        })
        // Handle any error from either jsonParse OR checkForId
        .mapErr((err) => {
            res(400, err.message)
        })

    // This creates a pipeline of operations where:
    // 1. Parse JSON (may fail with SyntaxError)
    // 2. If parsing succeeds, validate ID exists (may fail with "No id found" Error)
    // 3. If validation succeeds, return success response
    // 4. If either operation fails, return error response
}

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
