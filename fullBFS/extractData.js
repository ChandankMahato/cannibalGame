const fs = require("fs");

function extractData(path) {
  const networkData = fs.readFileSync(path, "utf-8");

  const edges = networkData.split("\n").map((line) => {
    const [source, target, distance, color, fromLevel, toLevel, I1, I2] =
      line.split(" ");
    return {
      from: source,
      to: target,
      distance: distance,
      color: color,
      fromLevel: fromLevel,
      toLevel: toLevel,
    };
  });

  const nodes = [];
  const finalEdges = [];
  var uniqueID = 0;
  edges.forEach((edge) => {
    if (!nodes.some((node) => node.id === edge.from + "," + edge.fromLevel + "," + edge.toLevel)) {
      nodes.push({ id: edge.from + "," + edge.fromLevel + "," + edge.toLevel, label: edge.from, color: edge.color, level: edge.fromLevel });
    }
    if (!nodes.some((node) => node.id === edge.to + "," + edge.toLevel + "," + edge.fromLevel)) {
      nodes.push({ id: edge.to + "," + edge.toLevel + "," + edge.fromLevel,label: edge.to, color: edge.color, level: edge.toLevel });
    }
    finalEdges.push({from: edge.from + "," + edge.fromLevel + "," + edge.toLevel, to: edge.to + "," + edge.toLevel + "," + edge.fromLevel, label: edge.distance});
  });
  return { edges: finalEdges, nodes: nodes }; 
}

module.exports = {
  extractData,
};