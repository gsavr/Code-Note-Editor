#!/usr/bin/env node
import { program } from "commander";
import { serveCommand } from "./commands/serve";

program.addCommand(serveCommand);

//to make error on process go away
//lerna add @types/node --dev --scope=clino
program.parse(process.argv);
