const fs = require("fs");

function extractData(path) {
  const networkData = fs.readFileSync(path, "utf-8");

  const edges = networkData.split("\n").map((line) => {
    const [source, target, distance, color, fromLevel, toLevel] = line.split(" ");
    return { from: source, to: target, distance: distance, color: color, fromLevel: fromLevel, toLevel: toLevel };
  });

  const nodes = [];
  edges.forEach((edge) => {
    if (!nodes.some((node) => node.id === edge.from)) {
      nodes.push({ id: edge.from, color: edge.color, level: edge.fromLevel  });
    }
    if (!nodes.some((node) => node.id === edge.to)) {
      nodes.push({ id: edge.to, color: edge.color, level: edge.toLevel });
    }
  });
  return { edges: edges, nodes: nodes };
}

module.exports = {
  extractData,
};
