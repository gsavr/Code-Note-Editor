import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

//create cached db in an environment like localStorage -- reverts to localStorage if not availble in the current browser
const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      //handle 'index.js
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      //check for cahched content
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //check to see if we already fetched this file -- and if it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        //if it is - return immediately
        if (cachedResult) {
          return cachedResult;
        }
      });

      //fetch css files
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        //fetch package from npm
        const { data, request } = await axios.get(args.path);
        //replace all \n new line with "" empty string
        const escaped = data
          //new lines removed
          .replace(/\n/g, "")
          //double quotes have been escaped
          .replace(/"/g, '\\"')
          //single quotes have been escaped
          .replace(/'/g, "\\'");
        const contents = `
         const style = document.createELement('style');
         style.InnerText = '${escaped}';
         document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: contents,
          //where we found the nested package ----- ('./',...)makes it so the index.js is taken out of the response
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        //store response in cache
        //1st arg is the key value stored in db - 2nd arg is the data stored
        await fileCache.setItem(args.path, result);

        return result;
      });

      //fetch js files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //fetch package from npm
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          //where we found the nested package ----- ('./',...)makes it so the index.js is taken out of the response
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        //store response in cache
        //1st arg is the key value stored in db - 2nd arg is the data stored
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
