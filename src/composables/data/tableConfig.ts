export type FilterType = 
  | 'faceted'        // Выпадающий список уникальных значений (type, actions, brand)
  | 'range'          // Слайдер диапазона (length, strength, silver, friction, mech)
  | 'rangeMinMax'    // Парный фильтр min/max (testMin/testMax)
  | 'switch'         // Переключатель boolean (sealed)
  | 'colorMulti'    // Мультичекбокс с миниатюрами цветов (colors)
  | 'none';          // Без фильтра

export type ComparisonType = 
  | 'more-is-better'    // Больше = лучше (strength, friction, mech)
  | 'less-is-better'    // Меньше = лучше (price, diameter)
  | 'none';             // Не сравнивать (name, type, colors)

export interface ColumnConfig {
  key: string;                    // Ключ поля в данных
  label: string;                  // Отображаемое название
  filterType: FilterType;         // Тип фильтра
  step?: number;                  // Шаг для range фильтров (0.1, 1)
  hidden?: boolean;                // Скрыта по умолчанию (устарело, используйте visible)
  visible?: boolean;              // Начальное состояние видимости колонки (по умолчанию true)
  sortable?: boolean;              // Можно сортировать (по умолчанию true)
  cellFormatter?: (value: any, row?: any) => string | number | null; // Форматирование ячейки
  isArray?: boolean;              // Поле является массивом (для sizes, prices, colors)
  comparisonType?: ComparisonType; // Тип сравнения для таблицы сравнения
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
  groupType?: string;              // Группа по типу снаряжения (удилища, катушки, аксессуары)
}

