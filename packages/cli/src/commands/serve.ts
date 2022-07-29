import path from "path";
import { Command } from "commander";
import { serve } from "@jsnote-gs/local-api";

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  //[filename] is an optional value of file name
  .command("serve [filename]")
  .description("Open a file for editing")
  //<> means mandatory
  .option("-p, --port <number>", "port to run server on", "4005") //default port will be 4005
  .action(async (filename = "notebook.js", options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      //options only include port, path.basename takes out name if relative path given, dir is relative path
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        //if production -- useProxy in local-api will be false
        !isProduction
      );
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit file`
      );
    } catch (err) {
      //@ts-ignore
      if (err.code === "EADDRINUSE") {
        console.error(
          "Port is in use. Try running on a different port by using cli command -p <port-number>"
        );
      } else {
        //@ts-ignore
        console.log("error:", err.message);
      }
      //if we are unable to run due to error. force exit the application
      process.exit(1);
    }
  });
