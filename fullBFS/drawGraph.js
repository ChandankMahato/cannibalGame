const fs = require("fs");
const { exec } = require("child_process");
const { extractData } = require("./extractData");
const { createHtmlContent } = require("./createHtmlContent");
const data = extractData("./fullBFS/test.txt");
const nodes = data.nodes;
const edges = data.edges;
fs.writeFile(
  "./fullBFS/fullBFS.html",
  createHtmlContent(nodes, edges, "State Space Tree"),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("./fullBFS.html file created successfully.");
    exec("start ./fullBFS/fullBFS.html", (error) => {
      if (error) {
        console.error(`Error opening file: ${error}`);
      }
    });
  }
);
