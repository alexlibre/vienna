import { DataSourceConfig } from '../tableConfig'
// @ts-ignore
import * as feeders from '@/assets/mock/RF4-feeders.json'

export const feedersConfig: DataSourceConfig = {
  id: 'feeders',
  label: 'Фидеры',
  groupType: 'Удилища',
  data: (feeders as any).default || [],
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
      comparisonType: 'less-is-better',
    },
    {
      key: 'testMax',
      label: 'Тест max.',
      filterType: 'none',
      sortable: true,
      comparisonType: 'more-is-better',
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
      comparisonType: 'more-is-better',
    },
    {
      key: 'rigidity',
      label: 'Жёсткость',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val ? `${val} / 10` : '—',
      comparisonType: 'more-is-better',
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
      key: 'cast',
      label: 'Дальность заброса',
      filterType: 'none',
      hidden: true,
      sortable: true,
      comparisonType: 'more-is-better',
    },
    {
      key: 'strength',
      label: 'Прочность, кг.',
      filterType: 'range',
      step: 0.1,
      sortable: true,
      cellFormatter: (val) => val || '—',
      comparisonType: 'more-is-better',
    },
    {
      key: 'level',
      label: 'Уровень',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
      comparisonType: 'less-is-better',
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

