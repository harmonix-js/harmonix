export type DeepPartial<T> = T extends (...args: never) => any
  ? T
  : T extends Record<string, any>
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T

export type OneOrMany<T> = T | T[]

export type Awaitable<T> = T | Promise<T>

export type MatchingKeys<T, Match> = {
  [K in keyof T]: T[K] extends Match ? K : never
}[keyof T]
