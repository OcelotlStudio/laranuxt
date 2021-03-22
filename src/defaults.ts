import { Options } from './options'

const defaults: Options = {
  root: process.cwd(),
  publicDir: 'public',
  server: true,
  dotEnvExport: false,
  envFile: '.env',
}

export default defaults
