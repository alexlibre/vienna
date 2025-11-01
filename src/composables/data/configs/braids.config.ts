import { DataSourceConfig } from '../tableConfig'
// @ts-ignore
import * as braids from '@/assets/mock/RF4-braids.json'

export const braidsConfig: DataSourceConfig = {
  id: 'braids',
  label: 'Леска',
  groupType: 'Аксессуары',
  data: (braids as any).default || [],
  columns: [
    {
      key: 'name',
      label: 'Название',
      filterType: 'none',
      sortable: false,
    },
    {
      key: 'type',
      label: 'Тип',
      filterType: 'faceted',
      sortable: true,
    },
    {
      key: 'strength',
      label: 'Прочность, кг',
      filterType: 'range',
      step: 0.1,
      sortable: true,
      comparisonType: 'more-is-better',
    },
    {
      key: 'diameter',
      label: 'Диаметр, мм',
      filterType: 'range',
      step: 0.01,
      sortable: true,
      comparisonType: 'less-is-better',
    },
    {
      key: 'size',
      label: 'Размер',
      filterType: 'faceted',
      sortable: true,
    },
    {
      key: 'price',
      label: 'Цена',
      filterType: 'range',
      step: 1,
      sortable: true,
      comparisonType: 'less-is-better',
    },
    {
      key: 'colors',
      label: 'Цвета',
      filterType: 'colorMulti',
      isArray: true,
      sortable: false,
    },
  ],
  defaultPageSize: 50,
}

