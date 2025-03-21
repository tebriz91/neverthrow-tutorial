// LESSON 2: Expected vs. Unexpected Errors with neverthrow
// This lesson covers the distinction between errors we anticipate and handle (expected)
// and those that should crash our program (unexpected)

import { err, ok, Result } from "neverthrow"

/**
 * jsonParse demonstrates the handling of expected vs unexpected errors
 *
 * Expected errors are domain-specific errors that:
 * - Are anticipated as part of normal operation
 * - Should be handled gracefully
 * - Return as err() Results
 *
 * Unexpected errors are programming errors that:
 * - Represent bugs or exceptional situations
 * - Should crash the application
 * - Are thrown rather than returned as Results
 */
const jsonParse = (input: string): Result<any, SyntaxError> => {
    try {
        return ok(JSON.parse(input))
    } catch (error) {
        // Expected error: SyntaxError from parsing invalid JSON
        // We anticipate this could happen with user input
        // We wrap it in an err() Result for proper handling
        if (error instanceof SyntaxError) {
            return err(error)
        }
        // Unexpected error: Any other error type
        // This would be unusual and indicates a programming issue
        // We rethrow it to crash and fix the underlying problem
        throw error
    }
}
