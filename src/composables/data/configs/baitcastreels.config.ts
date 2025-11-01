import { DataSourceConfig } from '../tableConfig'
// @ts-ignore
import * as baitcastReels from '@/assets/mock/RF4-baitcastreels.json'

export const baitcastreelsConfig: DataSourceConfig = {
  id: 'baitcastreels',
  label: 'Байткастинговые',
  groupType: 'Катушки',
  data: (baitcastReels as any).default || [],
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
      key: 'testRange',
      label: 'Тест',
      filterType: 'rangeMinMax',
      minMaxPair: {
        minKey: 'test3',
        maxKey: 'test'
      },
      step: 0.1,
      sortable: true,
    },
    {
      key: 'test',
      label: 'Тест',
      filterType: 'none',
      sortable: true,
    },
    {
      key: 'test2',
      label: 'Тест+',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || val === 0 ? val : '—',
    },
    {
      key: 'test3',
      label: 'Тест++',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || val === 0 ? val : '—',
    },
    {
      key: 'ratio1',
      label: 'Пер.число 1',
      filterType: 'none',
      sortable: true,
    },
    {
      key: 'ratio2',
      label: 'Пер.число 2',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
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
      label: 'Фрикцион+',
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
      key: 'mechUp',
      label: 'Механизм+',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
      comparisonType: 'more-is-better',
    },
    {
      key: 'level',
      label: 'Уровень',
      filterType: 'none',
      sortable: true,
      hidden: true,
      comparisonType: 'less-is-better',
      cellFormatter: (val) => val || '—',
    },
    {
      key: 'sealed',
      label: 'Защита',
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
  ],
  defaultPageSize: 50,
}

