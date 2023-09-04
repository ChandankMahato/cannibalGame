function createHtmlContent(nodes, edges, type) {
  const weightedEdges = edges.map((edge) => ({
    from: edge.from,
    to: edge.to,
    label: edge.distance.toString(),
  }));

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Graph Visualization</title>
      <style>
        #network-container {
          display: flex;
          width: 100%;
          height: 85vh;
          border: 2px solid lightgray;
        }

        #nav-bar {
          width: 100%;
          height: 60px;
        }

        h1 {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div id="nav-bar">
        <h1>Network Graph ${type}</h1>
      </div>
      <div id="network-container"> 
        <div id="graph-container"></div>
      </div>
      <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
      <script>
        const container = document.getElementById('graph-container');
        const data = {
          nodes: ${JSON.stringify(
            nodes.map((node) => ({ id: node.id, label: node.id, color: node.color == 1 ? 'red' : 'green'}))
          )},
          edges: ${JSON.stringify(weightedEdges)}
        };
        const options = { physics: false };
        new vis.Network(container, data, options);
      </script>
    </body>
    </html>
  `;
}

module.exports = {
  createHtmlContent,
};
