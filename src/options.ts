import path from 'path'
import dotenv from 'dotenv'
import { merge } from 'lodash'

import { NuxtConfig } from '@nuxt/types'

import defaults from './defaults'
import { moduleKey, nuxtOutputEnv } from './constants'

export interface Options {
  root?: string
  publicDir?: string
  outputPath?: string
  server?:
    | boolean
    | {
        host?: string
        port: number
      }
  dotEnvExport?: boolean
  envFile?: string
}

export const validateOptions = (
  options: Options
): options is Required<Omit<Options, 'outputPath'>> &
  Pick<Options, 'outputPath'> => {
  return (
    typeof options.root === 'string' &&
    typeof options.publicDir === 'string' &&
    (typeof options.server === 'boolean' ||
      (typeof options.server === 'object' &&
        typeof options.server.port === 'number')) &&
    typeof options.dotEnvExport === 'boolean' &&
    typeof options.envFile === 'string'
  )
}

export const getConfiguration = (
  nuxtOptions: NuxtConfig,
  overwrites?: Options
) => {
  const routerBase = (nuxtOptions.router && nuxtOptions.router.base) || '/'

  const options = merge({}, defaults, nuxtOptions.laravel, overwrites)

  if (!validateOptions(options)) {
    throw new Error('[nuxt-laravel] Invalid configuration')
  }

  const nuxt = {
    urlPath: path.posix.join(routerBase, moduleKey),
    routerPath: `/${moduleKey}`,
  }

  const laravel = (() => {
    const laravelRoot = path.resolve(process.cwd(), options.root)
    const server =
      typeof options.server === 'object'
        ? options.server
        : options.server && nuxtOptions.server
        ? {
            host: nuxtOptions.server.host,
            port: +(nuxtOptions.server.port || 3000) + 1,
          }
        : (false as false)

    if (
      server &&
      nuxtOptions.server &&
      server.host === nuxtOptions.server.host &&
      server.port === nuxtOptions.server.port
    ) {
      server.port = server.port + 1
    }

    return {
      root: laravelRoot,
      public: path.resolve(laravelRoot, options.publicDir),
      server,
    }
  })()

  const pathEnv = `${laravel.root}/${options.envFile}`

  dotenv.config({ path: pathEnv })
  const output = (() => {
    const outputPath = options.outputPath || process.env[nuxtOutputEnv]

    return {
      src: path.join(laravel.root, moduleKey),
      dest: path.join(laravel.public, routerBase),
      fallback: `${routerBase.length > 1 ? 'index' : 'spa'}.html`,
      additional: outputPath
        ? path.resolve(laravel.root, outputPath)
        : (false as false),
    }
  })()

  return {
    options,
    nuxt,
    laravel,
    output,
    routerBase,
  }
}
