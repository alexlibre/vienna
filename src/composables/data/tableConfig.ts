export type FilterType = 
  | 'faceted'        // Выпадающий список уникальных значений (type, actions, brand)
  | 'range'          // Слайдер диапазона (length, strength, silver, friction, mech)
  | 'rangeMinMax'    // Парный фильтр min/max (testMin/testMax)
  | 'switch'         // Переключатель boolean (sealed)
  | 'none';          // Без фильтра

export interface ColumnConfig {
  key: string;                    // Ключ поля в данных
  label: string;                  // Отображаемое название
  filterType: FilterType;         // Тип фильтра
  step?: number;                  // Шаг для range фильтров (0.1, 1)
  hidden?: boolean;                // Скрыта по умолчанию
  sortable?: boolean;              // Можно сортировать (по умолчанию true)
  cellFormatter?: (value: any, row?: any) => string | number | null; // Форматирование ячейки
  minMaxPair?: {                  // Для rangeMinMax
    minKey: string;
    maxKey: string;
  };
}

export interface DataSourceConfig {
  id: string;                      // ID для таба (spinings, feeders, etc)
  label: string;                   // Название таба
  data: any[];                     // Массив данных (загружается из JSON)
  columns: ColumnConfig[];         // Конфигурация колонок
  defaultPageSize?: number;        // Размер страницы по умолчанию (50)
}

