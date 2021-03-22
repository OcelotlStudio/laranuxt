import { NuxtConfig } from '@nuxt/types';
export interface Options {
    root?: string;
    publicDir?: string;
    outputPath?: string;
    server?: boolean | {
        host?: string;
        port: number;
    };
    dotEnvExport?: boolean;
    envFile?: string;
}
export declare const validateOptions: (options: Options) => options is Required<Pick<Options, "server" | "root" | "publicDir" | "dotEnvExport" | "envFile">> & Pick<Options, "outputPath">;
export declare const getConfiguration: (nuxtOptions: NuxtConfig, overwrites?: Options | undefined) => {
    options: Required<Pick<Options, "server" | "root" | "publicDir" | "dotEnvExport" | "envFile">> & Pick<Options, "outputPath">;
    nuxt: {
        urlPath: string;
        routerPath: string;
    };
    laravel: {
        root: string;
        public: string;
        server: false | {
            host?: string | undefined;
            port: number;
        };
    };
    output: {
        src: string;
        dest: string;
        fallback: string;
        additional: string | false;
    };
    routerBase: string;
};
