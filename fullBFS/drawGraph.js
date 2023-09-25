const fs = require("fs");
const { exec } = require("child_process");
const { extractData } = require("./extractData");
const { createHtmlContent } = require("./createHtmlContent");
const nodeMapping = {};
const data = extractData("./fullBFS/data.txt", nodeMapping);
const nodes = data.nodes;
const edges = data.edges;
fs.writeFile(
  "./fullBFS/fullBFS.html",
  createHtmlContent(nodes, edges, "State Space Tree", nodeMapping),
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
