import { Module } from '@nuxt/types';
import { moduleKey, laravelAppEnv, nuxtOutputEnv } from './constants';
import { Options } from './options';
declare const laravelModule: Module<Options>;
declare module '@nuxt/types' {
    interface NuxtConfig {
        laravel?: Options;
    }
}
export { Options, moduleKey, laravelAppEnv, nuxtOutputEnv };
export default laravelModule;
export declare const meta: any;
