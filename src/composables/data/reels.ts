import { KeysEnum } from "@/types/keys";

export interface IReel {
  name: string;
  brand: string;
  size: number;
  sealed: boolean;
  test: number;
  ratio: number;
  speed: number;
  friction: number;
  frictionUp: number | null;
  mech: number;
  level: number;
  silver: number;
  gold: number;
}

export const keyDict: KeysEnum<IReel> = {
  name: "Название",
  brand: "Бренд",
  size: "Размер",
  sealed: "Защита от сол.воды",
  test: "Тест, гр.",
  ratio: "Пер.число",
  speed: "Скорость",
  friction: "Фрикцион, кг.",
  frictionUp: "Фрикцион улучш., кг.",
  mech: "Механизм, кг.",
  level: "Уровень",
  silver: "Цена, сер.",
  gold: "Цена, зол.",
};
