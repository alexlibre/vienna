import { KeysEnum } from "@/types/keys";

export interface IPowerReel {
    name: string;
    brand: string;
    sealed: boolean;
    test: number;
    ratio1: number;
    ratio2: number;
    speed1: number;
    speed2: number;
    friction: number;
    mech: number;
    level: number;
    silver: number;
    gold: number;
  }
  
  export const keyDict: KeysEnum<IPowerReel> = {
    name: "Название",
    brand: "Бренд",
    sealed: "Защита от сол.воды",
    test: "Тест, гр.",
    ratio1: "Пер.число 1",
    ratio2: "Пер.число 2",
    speed1: "Скорость 1",
    speed2: "Скорость 2",
    friction: "Фрикцион, кг.",
    mech: "Механизм, кг.",
    level: "Уровень",
    silver: "Цена, сер.",
    gold: "Цена, зол.",
  };
  