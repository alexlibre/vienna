import { DataSourceConfig } from '../tableConfig'
// @ts-ignore
import * as baitcastReels from '@/assets/mock/RF4-baitcastreels.json'

export const baitcastreelsConfig: DataSourceConfig = {
  id: 'baitcastreels',
  label: 'Байткастинговые катушки',
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
      key: 'test',
      label: 'Тест',
      filterType: 'range',
      step: 0.1,
      sortable: true,
    },
    {
      key: 'test2',
      label: 'Тест min.',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
    },
    {
      key: 'test3',
      label: 'Тест mid.',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
      hidden: true,
    },
    {
      key: 'test',
      label: 'Тест max.',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
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
    },
    {
      key: 'frictionUp',
      label: 'Фрикцион улучш., кг.',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
    },
    {
      key: 'mech',
      label: 'Механизм, кг.',
      filterType: 'range',
      step: 0.1,
      sortable: true,
    },
    {
      key: 'mechUp',
      label: 'Механизм улучш., кг.',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
    },
    {
      key: 'level',
      label: 'Уровень',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
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
    },
  ],
  defaultPageSize: 50,
}

