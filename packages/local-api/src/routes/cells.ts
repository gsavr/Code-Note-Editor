import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    try {
      //Read file
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      //parse a list of cells out of it
      //send list of cells to browser
      res.send(JSON.parse(result));
    } catch (err) {
      //if error - see if it says the file doesn't exist
      //@ts-ignore
      if (err.code === "ENOENT") {
        //add code to create file and add default cells
        await fs.writeFile(fullPath, "[]", "utf-8");
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    //take list of cells from req obj
    //serialize them
    const { cells }: { cells: Cell[] } = req.body;

    //write cells into file
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });

  return router;
};
