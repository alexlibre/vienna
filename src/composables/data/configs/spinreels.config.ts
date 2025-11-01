import { DataSourceConfig } from '../tableConfig'
// @ts-ignore
import * as reels from '@/assets/mock/RF4-spinreels.json'

export const spinreelsConfig: DataSourceConfig = {
  id: 'spinreels',
  label: 'Безынерционные',
  groupType: 'Катушки',
  data: (reels as any).default || [],
  columns: [
    {
      key: 'name',
      label: 'Название',
      filterType: 'none',
      sortable: false,
    },
    {
      key: 'brand',
      label: 'Бренд',
      filterType: 'faceted',
      sortable: true,
    },
    {
      key: 'size',
      label: 'Размер',
      filterType: 'faceted',
      sortable: true,
    },
    {
      key: 'ratio',
      label: 'Пер.число',
      filterType: 'none',
      sortable: true,
    },
    {
      key: 'friction',
      label: 'Фрикцион, кг.',
      filterType: 'range',
      step: 0.1,
      sortable: true,
      comparisonType: 'more-is-better',
    },
    {
      key: 'frictionUp',
      label: 'Фрикцион улучш., кг.',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
      comparisonType: 'more-is-better',
    },
    {
      key: 'mech',
      label: 'Механизм, кг.',
      filterType: 'range',
      step: 0.1,
      sortable: true,
      comparisonType: 'more-is-better',
    },
    {
      key: 'sealed',
      label: 'Защита от солёной воды',
      filterType: 'switch',
      sortable: false,
    },
    {
      key: 'silver',
      label: 'Цена, сер.',
      filterType: 'range',
      step: 1,
      sortable: true,
      cellFormatter: (val) => val || '—',
      comparisonType: 'less-is-better',
    },
    {
      key: 'gold',
      label: 'Цена, зол.',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
      comparisonType: 'less-is-better',
    },
  ],
  defaultPageSize: 50,
}

