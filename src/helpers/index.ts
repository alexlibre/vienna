import { Updater } from "@tanstack/vue-table";
import { Ref } from "vue";

export function valueUpdater<T>(
  updaterOrValue: Updater<T>,
  ref: Ref<T>
) {
  ref.value =
    typeof updaterOrValue === "function"
      ? (updaterOrValue as (old: T) => T)(ref.value)
      : (updaterOrValue as T);
}

export type Option = { label: string; value: string | number };

export function uniqueOptions<T>(
  items: readonly T[],
  selector: (item: T) => string | number
): Option[] {
  const seen = new Set<string | number>();
  const result: (string | number)[] = [];
  for (const item of items) {
    const key = selector(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(key);
    }
  }
  return result.sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a > b ? 1 : -1;
    }
    return String(a).localeCompare(String(b));
  }).map((v) => ({ label: String(v), value: v }));
}

export function computeRange<T>(
  items: readonly T[],
  selector: (item: T) => number
): [number, number] {
  if (items.length === 0) return [0, 0];
  let min = Infinity;
  let max = -Infinity;
  for (const item of items) {
    const n = selector(item);
    if (n < min) min = n;
    if (n > max) max = n;
  }
  return [min, max];
}

// Извлечение уникальных значений из массива (для colors, sizes как массивы)
export function uniqueOptionsFromArray<T>(
  items: readonly T[],
  selector: (item: T) => (string | number)[] | null | undefined
): Option[] {
  const seen = new Set<string | number>();
  for (const item of items) {
    const arr = selector(item);
    if (Array.isArray(arr)) {
      for (const val of arr) {
        if (val !== null && val !== undefined) {
          seen.add(val);
        }
      }
    }
  }
  return Array.from(seen).sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a > b ? 1 : -1;
    }
    return String(a).localeCompare(String(b));
  }).map((v) => ({ label: String(v), value: v }));
}

// Вычисление диапазона из массива чисел (для prices, sizes как массивы)
export function computeRangeFromArray<T>(
  items: readonly T[],
  selector: (item: T) => number[] | null | undefined
): [number, number] {
  if (items.length === 0) return [0, 0];
  let min = Infinity;
  let max = -Infinity;
  for (const item of items) {
    const arr = selector(item);
    if (Array.isArray(arr)) {
      for (const n of arr) {
        if (n < min) min = n;
        if (n > max) max = n;
      }
    }
  }
  return [min === Infinity ? 0 : min, max === -Infinity ? 0 : max];
}
