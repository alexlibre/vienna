import { DataSourceConfig } from '../tableConfig'
// @ts-ignore
import * as powerReels from '@/assets/mock/RF4-power.json'

export const powerreelsConfig: DataSourceConfig = {
  id: 'powerreels',
  label: 'Силовые катушки',
  data: (powerReels as any).default || [],
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
      key: 'speed1',
      label: 'Скорость 1',
      filterType: 'none',
      sortable: true,
    },
    {
      key: 'speed2',
      label: 'Скорость 2',
      filterType: 'none',
      sortable: true,
    },
    {
      key: 'friction',
      label: 'Фрикцион, кг.',
      filterType: 'range',
      step: 0.1,
      sortable: true,
    },
    {
      key: 'mech',
      label: 'Механизм, кг.',
      filterType: 'range',
      step: 0.1,
      sortable: true,
      cellFormatter: (val) => val || 'нет данных',
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
    {
      key: 'gold',
      label: 'Цена, зол.',
      filterType: 'none',
      sortable: true,
      cellFormatter: (val) => val || '—',
    },
  ],
  defaultPageSize: 50,
}

