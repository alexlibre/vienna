export type KeysEnum<T> = { [P in keyof Required<T>]: string };
