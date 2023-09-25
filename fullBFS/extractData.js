const fs = require("fs");

function extractData(path, nodeMapping) {
  const networkData = fs.readFileSync(path, "utf-8");

  const edges = networkData.split("\n").map((line) => {
    const [source, target, distance, color, fromLevel, toLevel] =
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
  // const finalEdges = [];
  let uinqueID = 0;
  edges.forEach((edge) => {
    // nodes.push({ id: edge.from, color: edge.color, level: edge.fromLevel });
    nodes.push({
      id: uinqueID,
      color: edge.color,
      level: edge.fromLevel,
      label: edge.from,
    });
    nodeMapping[edge.from] = uinqueID;
    uinqueID++;
    // nodes.push({ id: edge.to, color: edge.color, level: edge.toLevel });
    nodes.push({
      id: uinqueID,
      color: edge.color,
      level: edge.toLevel,
      label: edge.to,
    });
    nodeMapping[edge.to] = uinqueID;
    uinqueID++;
    // }
    // }
  });
  return { edges: edges, nodes: nodes };
}

module.exports = {
  extractData,
};
