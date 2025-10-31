import { spiningsConfig } from './spinings.config'
import { feedersConfig } from './feeders.config'
import { floatConfig } from './float.config'
import { seaConfig } from './sea.config'
import { spinreelsConfig } from './spinreels.config'
import { powerreelsConfig } from './powerreels.config'
import { baitcastreelsConfig } from './baitcastreels.config'

export { spiningsConfig } from './spinings.config'
export { feedersConfig } from './feeders.config'
export { floatConfig } from './float.config'
export { seaConfig } from './sea.config'
export { spinreelsConfig } from './spinreels.config'
export { powerreelsConfig } from './powerreels.config'
export { baitcastreelsConfig } from './baitcastreels.config'

export const allDataSources = [
  spiningsConfig,
  feedersConfig,
  floatConfig,
  seaConfig,
  spinreelsConfig,
  powerreelsConfig,
  baitcastreelsConfig,
] as const

