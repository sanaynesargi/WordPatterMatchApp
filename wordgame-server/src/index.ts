import express from "express";
import cors from "cors";
import fs from "fs";

function between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

let CHUNKS: string[][];
let INDEX = 0;

fs.readFile(__dirname + "/results.txt", "utf8", (err: any, data: string) => {
  if (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    return;
  }
  // tslint:disable-next-line:no-console
  const splitData = data.split("\n");
  const chunks = [] as string[][];
  let currChunk = [] as string[];
  for (data of splitData) {
    if (data === "") {
      chunks.push(currChunk);
      currChunk = [];
      continue;
    }

    if (currChunk.length === 0) {
      currChunk.push(data.slice(11, data.length));
      continue;
    }

    currChunk.push(data);
  }
  CHUNKS = chunks;
  INDEX = between(0, chunks.length - 1);
});
const app = express();

const port = 8080; // default port to listen

app.use(cors());

// define a route handler for the default home page
app.get("/", (_, res) => {
  res.json({ response: "Server Reached" });
});

app.get("/words", (_, res) => {
  // console.log(CHUNKS[INDEX][1]);
  res.json({
    words: CHUNKS[INDEX][0].split(", "),
    word: CHUNKS[INDEX][1].slice(1, CHUNKS[INDEX][1].length).split(","),
    day: INDEX,
  });
});

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
