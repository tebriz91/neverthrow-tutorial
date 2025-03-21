# Neverthrow Tutorial

This tutorial teaches you how to use the [neverthrow](https://github.com/supermacro/neverthrow) library to handle errors in a functional programming style. Neverthrow provides a `Result` type that represents either success (`Ok`) or failure (`Err`), allowing you to handle errors without throwing exceptions.

## What You'll Learn

1. **Basic Result Usage**: Creating `Ok` and `Err` values with the `ok()` and `err()` functions.
2. **Expected vs Unexpected Errors**: Distinguishing between errors you should handle and those that should crash your app.
3. **Handling Results**: Using `isOk()` and `isErr()` to safely handle both success and error cases.
4. **Transforming Results**: Using `map()` and `mapErr()` to transform success and error values.
5. **Pattern Matching**: Using `match()` to handle both cases in a single function call.
6. **Chaining Operations**: Using `andThen()` to compose multiple Result-returning functions.
7. **Type Safety**: Understanding why explicit Result type annotations are important.

## Railway Oriented Programming

Neverthrow implements the "Railway Oriented Programming" pattern, where:
- Success values flow down the "happy path" track
- Error values flow down a parallel "error" track
- Functions and operations are applied only to values on the appropriate track
- This creates clean, declarative error handling without try/catch blocks

## Quickstart

### Install PNPM

Because this course is _so big_ we're using `pnpm` as the package manager. It's like `npm`, but results in fewer `node_modules` saved to disk.

[Install `pnpm` globally](https://pnpm.io/installation).

### Install Dependencies

```sh
# Installs all dependencies
pnpm install

# Asks you which exercise you'd like to run, and runs it
pnpm run exercise
```

## How to take the course

You'll notice that the course is split into exercises. Each exercise is split into a `*.problem` and a `*.solution`.

To take an exercise:

1. Run `pnpm exercise`
2. Choose which exercise you'd like to run.

This course encourages **active, exploratory learning**. In the video, I'll explain a problem, and **you'll be asked to try to find a solution**. To attempt a solution, you'll need to:

1. Check out [TypeScript's docs](https://www.typescriptlang.org/docs/handbook/intro.html).
1. Try to find something that looks relevant.
1. Give it a go to see if it solves the problem.

You'll know if you've succeeded because the tests will pass.

**If you succeed**, or **if you get stuck**, unpause the video and check out the `*.solution`. You can see if your solution is better or worse than mine!

## Acknowledgements

Say thanks to Matt on [Twitter](https://twitter.com/mattpocockuk) or by joining his [Discord](https://discord.gg/8S5ujhfTB3). Consider signing up to his [Total TypeScript course](https://totaltypescript.com).

## Reference

### `pnpm run exercise`

Alias: `pnpm run e`

Open a prompt for choosing which exercise you'd like to run.
