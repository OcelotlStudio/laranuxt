# Nuxt Laravel

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen.github.io/cz-cli/)
[![npm](https://img.shields.io/npm/v/@ocelotlstudio/laranuxt)](https://www.npmjs.com/package/@ocelotlstudio/laranuxt)

This module makes it easy to integrate a [NuxtJS](https://nuxtjs.org) SPA into a [Laravel](https://laravel.com) application.  
The implementation is based on [laravel-nuxt-js](https://github.com/skyrpex/laravel-nuxt-js) by [skyrpex](https://github.com/skyrpex).

This fork updates dependencies and enables option for compiling in multiples enviroments through ```.env``` files.

There is a companion extension also based on [skyrpex](https://github.com/skyrpex)'s work, which makes it very easy to set up nuxt inside an existing laravel project: [m2s/laravel-nuxt](https://github.com/m2sd/laravel-nuxt)

> *Hint*: Use the companion extension for routing integration with laravel.

## Features

* Easily deploy an existing Nuxt app inside a Laravel application or vice versa
* Test your Nuxt app with live reloading, HMR and the auto-configured Laravel test server
* Seamlessly integrate Nuxt into the URL resolution of Laravel
* Easy integration with sanctum

## Setup

### Installation

Install this package.

```bash
npm install --save-dev @ocelotlstudio/laranuxt
```

or

```bash
yarn add --dev @ocelotlstudio/laranuxt
```

#### Typescript

To have code completion/type checking on the `Configuration` interface from `@nuxt/types`, include the package in your `tsconfig.json`.

```json
{
  "compilerOptions": {
    // ...
    "types": [
        "@nuxt/types",
        // ...
        "@ocelotlstudio/laranuxt"
    ]
  }
}
```

### Configuration

Simply include `nuxt-laravel` in `modules` and set the `ssr` setting to `false` in your `nuxt.config.js`

```js
export default {
  ssr: false,
  modules: [
    // Include it first, so that configuration alterations are propagated to other modules
    '@ocelotlstudio/laranuxt'
    // ... other modules
  ]
}
```

If your `package.json` lives in the Laravel root folder you are done.

Otherwise set the path to your Laravel root folder through the configuration.

```js
export default {
  ssr: false,
  modules: [
    '@ocelotlstudio/laranuxt'
  ],
  laravel: {
    root: './path/to/laravel'
  }
}
```

### Module Options

| option         | type                  | description                                                                                                                                                                   | default         |
| -------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `root`         | `string`              | Path to laravel directory (is resolved relative to `process.cwd()`)                                                                                                           | `process.cwd()` |
| `publicDir`    | `string`              | The folder where laravel serves assets from (is resolved relative to `root`)                                                                                                  | `'public'`      |
| `outputPath`   | `string`              | File location to which an additional index route will be rendered, useful if you want to store it in a folder outside of Laravels public dir (is resolved relative to `root`) | `null`          |
| `server`       | `boolean` or `object` | Settings for the Laravel testserver                                                                                                                                           | *(see below)*   |
| `dotEnvExport` | `boolean`             | Whether the `NUXT_OUTPUT_PATH` varibale should be written to the `.env` file in the laravel root directory                                                                    | `false`         |
| `envFile`      | `string`              | `.env` file name, useful if you want to use multiple enviroment settings | `null`     | 

The module loads the default `.env`  or `envFile` specified from your laravel root, so you can set the `NUXT_OUTPUT_PATH` environment variable from there.

#### The `server` setting

If this setting is set to `false` the module will be disabled for development.  
Setting this to `true` is equivalent to omitting it and will simply use the default configuration.

| option | type     | description                 | default                      |
| ------ | -------- | --------------------------- | ---------------------------- |
| `host` | `string` | Hostname for the testserver | `nuxtConfig.server.host`     |
| `port` | `number` | Port for the testserver     | `nuxtConfig.server.port + 1` |

#### Path resolution inside `publicDir`

If `nuxtConfig.router.base` is not set the SPA will be generated in the `publicDir` root with an index file name of `spa.html`.  
If `nuxtConfig.router.base` is set the SPA will be generated in a corresponding location inside `publicDir` with the default index file name `index.html`.

## Laravel integration

Laravel integration is accomplished through two environment variables.

* **`APP_URL`:**  
  Laravel uses this to generate asset URLs.  
  * When the Laravel test server is started through this module this variable is overwritten with the nuxt test server URL origin via `putenv`.

* **`NUXT_OUTPUT_PATH`:**  
  Use this variable to redirect all web traffic to, which you want handled by nuxt.  
  * When the Laravel test server is started through this module this variable is overwritten with a special index route on the nuxt test server via `putenv`.  
  * When nuxt is build through this module (and `dotEnvExport` is truthy) this variable will be written to the `.env` file in laravels root directory, containing the resolved `outputPath` (see above).

> **❗❗❗ Attention ❗❗❗:**  
> Make sure your `putenv` is in the `disabled_functions` in your `php.ini`  
> and that `putenv` support is enabled for the laravel `env()` helper.
>
> Alternatively (still: if `putenv` is enabled in PHP) you can just use the `getenv()` function directly.  
> If you want to use `putenv` directly you should update your `config/app.php` to get `APP_URL` that way.

### Example scaffolding in existent Laravel application

#### The easy way

1. Install [m2s/laravel-nuxt](https://github.com/m2sd/laravel-nuxt):

   ```sh
   composer require m2s/laravel-nuxt
   ```

2. Execute the install command (`<source>` can be omitted and defaults to `resources/nuxt`)

   ```sh
   php artisan nuxt:install <source>
   ```

#### The hard (all configuration in project root) way

1. Create a new nuxt app in `resources/nuxt`

   ```bash
   npx create-nuxt-app resources/nuxt
   ```

2. Migrate all dependencies and scipts (most importantly `dev` and `build`) from `resources/nuxt/package.json` into `package.json` in Laravel root and delete it
3. Move all configuration files from `resources/nuxt` to Laravel root (or merge where appropiate, e.g. `.editorconfig`)
4. Install the module and it's peer dependencies

   ```bash
   npm i -D @ocelotlstudio/nuxt-laravel @nuxtjs/axios @nuxtjs/proxy
   ```

5. Update `nuxt.config.js`

   ```js
   module.exports = {
     srcDir: 'resources/nuxt',
     ssr: false,
     // ... other config
     modules: [
       '@ocelotlstudio/laranuxt',
       // ... other modules
     ]
   }
   ```

6. (Optional) If you use jest, or other tools that reference the Nuxt root independently, you have to update thier respective configuration to make them work correctly.  
   Example `jest.config.js`:

   ```js
   module.exports = {
     rootDir: 'resources/nuxt',
     // ... other configurtion
   }
   ```

### Example Laravel configuration

#### Forwarding all undefined routes to nuxt

`routes/web.php`:

```php
// ...
// Add this route last as a catch all for undefined routes.
Route::get(
    '/{path?}',
    function($request) {
      // ...
      // If the request expects JSON, it means that
      // someone sent a request to an invalid route.
      if ($request->expectsJson()) {
          abort(404);
      }

      // Fetch and display the page from the render path on nuxt dev server or fallback to static file
      return file_get_contents(env('NUXT_OUTPUT_PATH', public_path('spa.html'));
    }
)->where('path', '.*')
 // Redirect to Nuxt from within Laravel
 // by using Laravels route helper
 // e.g.: `route('nuxt', ['path' => '/<nuxtPath>'])`
 ->name('nuxt');
```

#### Forward multiple specific routes to nuxt (using [laravel-nuxt](https://github.com/m2sd/laravel-nuxt))

This example assumes option `nuxtConfig.router.base` to have been set to `'/app/'`

> **❗❗❗ Attention ❗❗❗:**  
> Nuxt router has problems resolving the root route without a trailing slash.  
> You will have to handle this in your server configuration:
>
> * **Nginx:** `rewrite ^/app$ /app/ last;`
> * **Apache:** `RewriteRule ^/app$ /app/ [L]`
> * **Artisan:**
>   In `server` file:
>
>   ```php
>   // ...
>
>   // This file allows us to emulate Apache's "mod_rewrite" functionality from the
>   // built-in PHP web server. This provides a convenient way to test a Laravel
>   // application without having installed a "real" web server software here.
>   if ('/app' === $uri) {
>       header('Status: 301 Moved Permanently', false, 301);
>       header('Location: '.$uri.'/');
>
>       return true;
>   } elseif ('/' !== $uri && file_exists(__DIR__.'/public'.$uri)) {
>       return false;
>   }
>
>   // ...
>   ```

`config/nuxt.php`:

```php
return [
    'routing' => false,
    'prefix'  => 'app'
    'source'  => env('NUXT_OUTPUT_PATH', public_path('app/index.html'))
];
```

`routes/web.php`:

```php

use M2S\LaravelNuxt\Facades\Nuxt;
/**
 * Forward specific route to nuxt router
 *
 * This route is redered by `<nuxtRoot>/pages/index.vue`
 */
Nuxt::route('/')->name('nuxt');

/**
 * Forward all paths under a specific URI to nuxt router
 *
 * These routes are rendered by:
 * - if `{path} = '/'`
 *   `<nuxtRoot>/pages/subpage.vue`
 *    or
 *   `<nuxtRoot>/pages/subpage/index.vue`
 *
 * - if `{path} = '/<path>'` (`<path>` may contain slashes '/')
 *   `<nuxtRoot>/pages/subpage/<path>.vue`
 *   or
 *   `<nuxtRoot>/pages/subpage/<path>/index.vue`
 */
Nuxt::route('subpage/{path?}')->where('path', '.*')
 // Redirect to a spcific subpage/<path> from within Laravel
 // by using Laravels route helper
 // e.g.: `route('nuxt.subpage', ['path' => '/<path>'])`
 ->name('nuxt.subpage');
```
