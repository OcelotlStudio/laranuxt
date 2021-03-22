"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguration = exports.validateOptions = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const lodash_1 = require("lodash");
const defaults_1 = __importDefault(require("./defaults"));
const constants_1 = require("./constants");
const validateOptions = (options) => {
    return (typeof options.root === 'string' &&
        typeof options.publicDir === 'string' &&
        (typeof options.server === 'boolean' ||
            (typeof options.server === 'object' &&
                typeof options.server.port === 'number')) &&
        typeof options.dotEnvExport === 'boolean' &&
        typeof options.envFile === 'string');
};
exports.validateOptions = validateOptions;
const getConfiguration = (nuxtOptions, overwrites) => {
    const routerBase = (nuxtOptions.router && nuxtOptions.router.base) || '/';
    const options = lodash_1.merge({}, defaults_1.default, nuxtOptions.laravel, overwrites);
    if (!exports.validateOptions(options)) {
        throw new Error('[nuxt-laravel] Invalid configuration');
    }
    const nuxt = {
        urlPath: path_1.default.posix.join(routerBase, constants_1.moduleKey),
        routerPath: `/${constants_1.moduleKey}`,
    };
    const laravel = (() => {
        const laravelRoot = path_1.default.resolve(process.cwd(), options.root);
        const server = typeof options.server === 'object'
            ? options.server
            : options.server && nuxtOptions.server
                ? {
                    host: nuxtOptions.server.host,
                    port: +(nuxtOptions.server.port || 3000) + 1,
                }
                : false;
        if (server &&
            nuxtOptions.server &&
            server.host === nuxtOptions.server.host &&
            server.port === nuxtOptions.server.port) {
            server.port = server.port + 1;
        }
        return {
            root: laravelRoot,
            public: path_1.default.resolve(laravelRoot, options.publicDir),
            server,
        };
    })();
    const pathEnv = `${laravel.root}/${options.envFile}`;
    dotenv_1.default.config({ path: pathEnv });
    const output = (() => {
        const outputPath = options.outputPath || process.env[constants_1.nuxtOutputEnv];
        return {
            src: path_1.default.join(laravel.root, constants_1.moduleKey),
            dest: path_1.default.join(laravel.public, routerBase),
            fallback: `${routerBase.length > 1 ? 'index' : 'spa'}.html`,
            additional: outputPath
                ? path_1.default.resolve(laravel.root, outputPath)
                : false,
        };
    })();
    return {
        options,
        nuxt,
        laravel,
        output,
        routerBase,
    };
};
exports.getConfiguration = getConfiguration;
