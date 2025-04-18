import { KeysEnum } from "@/types/keys";

export interface ISeaRod {
  name: string;
  type: string;
  testMin: number;
  testMax: number;
  length: number;
  sensitivity: number;
  rigidity: number;
  actions: string;
  exp: string;
  buff: string;
  skills: string;
  cast: string;
  strength: number;
  level: number;
  silver: number;
}

export const keyDict: KeysEnum<ISeaRod> = {
  name: "Название",
  type: "Тип",
  testMin: "Тест min.",
  testMax: "Тест max.",
  length: "Длина",
  sensitivity: "Чувств.",
  rigidity: "Жёст.",
  actions: "Строй",
  exp: "Опыт",
  buff: "Бонус",
  skills: "Навыки",
  cast: "Дальность заброса",
  strength: "Прочность, кг.",
  level: "Уровень",
  silver: "Цена, сер.",
};
