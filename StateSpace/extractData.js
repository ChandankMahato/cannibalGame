const fs = require("fs");

function extractData(path) {
  const networkData = fs.readFileSync(path, "utf-8");

  const edges = networkData.split("\n").map((line) => {
    const [source, target, distance, color] = line.split(" ");
    return { from: source, to: target, distance: distance, color: color };
  });

  const nodes = [];
  edges.forEach((edge) => {
    if (!nodes.some((node) => node.id === edge.from)) {
      nodes.push({ id: edge.from, color: edge.color });
    }
    if (!nodes.some((node) => node.id === edge.to)) {
      nodes.push({ id: edge.to, color: edge.color });
    }
  });
  return { edges: edges, nodes: nodes };
}

module.exports = {
  extractData,
};
