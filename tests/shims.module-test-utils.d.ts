declare module '@nuxtjs/module-test-utils' {
  import { NuxtConfig } from '@nuxt/types'
  import { Options } from 'request-promise'

  export type BeforeNuxtReadyFn = (nuxt: any /*TBD*/) => Promise<void>

  export const init: (
    config: NuxtConfig,
    options?: { beforeNuxtReady?: BeforeNuxtReadyFn }
  ) => Promise<any /*TBD*/>

  export const build: (
    config: NuxtConfig,
    options?: {
      waitFor?: number
      beforeNuxtReady?: BeforeNuxtReadyFn
    }
  ) => Promise<{ nuxt: any /*TBD*/; builder: any /*TBD*/ }>

  export const generate: (
    config: NuxtConfig,
    options?: { build?: boolean; init?: boolean },
    initOptions?: { beforeNuxtReady?: BeforeNuxtReadyFn }
  ) => Promise<{
    nuxt: any /*TBD*/
    builder: any /*TBD*/
    generator: any /*TBD*/
  }>

  export const loadConfig: (
    dir: string,
    fixture?: string | null,
    override?: NuxtConfig,
    options?: { merge?: boolean }
  ) => NuxtConfig

  export const setup: (
    config: NuxtConfig,
    options?: {
      port?: number
      waitFor?: number
      beforeNuxtReady?: BeforeNuxtReadyFn
    }
  ) => Promise<{ nuxt: any /*TBD*/; builder: any /*TBD*/ }>

  export const generatePort: (port?: number) => Promise<number>

  export const get: (path: string, options?: Options) => Promise<any>

  export const url: (path?: string) => string
}
