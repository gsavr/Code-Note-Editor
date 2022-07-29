import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      //(^index\.js$) is a regular expression that will fins files with name index.js exactly only - //handle root file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });
      //handle relative paths in a module ("./") or ("../")
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          //resolveDir comes out of request from onLoad -- will work for nested packages //.href makes it a string
          path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
        };
      });
      //handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
