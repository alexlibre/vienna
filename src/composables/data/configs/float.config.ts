import { DataSourceConfig } from '../tableConfig'
// @ts-ignore
import * as float from '@/assets/mock/RF4-float.json'

export const floatConfig: DataSourceConfig = {
  id: 'float',
  label: 'Поплавки',
  data: (float as any).default || [],
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
      key: 'test',
      label: 'Тест',
      filterType: 'rangeMinMax',
      minMaxPair: {
        minKey: 'testMin',
        maxKey: 'testMax'
      },
      sortable: true,
    },
    {
      key: 'testMin',
      label: 'Тест min.',
      filterType: 'none',
      sortable: true,
    },
    {
      key: 'testMax',
      label: 'Тест max.',
      filterType: 'none',
      sortable: true,
    },
    {
      key: 'length',
      label: 'Длина',
      filterType: 'range',
      step: 0.1,
      sortable: true,
    },
    {
      key: 'sensitivity',
      label: 'Чувствительность',
      filterType: 'none',
      hidden: true,
      sortable: true,
    },
    {
      key: 'rigidity',
      label: 'Жёсткость',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val ? `${val} / 10` : '—',
    },
    {
      key: 'actions',
      label: 'Строй',
      filterType: 'faceted',
      sortable: true,
    },
    {
      key: 'exp',
      label: 'Опыт',
      filterType: 'none',
      sortable: true,
    },
    {
      key: 'buff',
      label: 'Бонус',
      filterType: 'none',
      sortable: true,
    },
    {
      key: 'skills',
      label: 'Навыки',
      filterType: 'none',
      sortable: true,
    },
    {
      key: 'strength',
      label: 'Прочность, кг.',
      filterType: 'range',
      step: 0.1,
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

