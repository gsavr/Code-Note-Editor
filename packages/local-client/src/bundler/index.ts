import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let service: esbuild.Service;

export const bundler = async (rawCode: string) => {
  if (!service) {
    //run service first time
    service = await esbuild.startService({
      worker: true,
      //esbuild.wasm is in public dir for easy access
      //changed to directing to unpkg link
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm", //"/esbuild.wasm",
    });
  }

  //result ----
  try {
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        //helps some packages that need global defined or have if statements for non-production env
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
      //reference to code-cell.tsx cumulativeCode
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });
    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (err: any) {
    return {
      code: "",
      err: err.message,
    };
  }
};
