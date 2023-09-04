const fs = require("fs");
const { extractData } = require("./extractData.js");
const { createHtmlContent } = require("./createHtmlContent.js");
const { exec } = require("child_process");

const data = extractData("./StateSpace/data.txt");
const nodes = data.nodes;
const edges = data.edges;
fs.writeFile(
  "./statespace.html",
  createHtmlContent(nodes, edges, "State Space Tree"),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("./statespace.html file created successfully.");
    exec("start ./statespace.html", (error) => {
      if (error) {
        console.error(`Error opening file: ${error}`);
      }
    });
  }
);