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
      height: 550px;
      border: 2px solid lightgray;
    }

    #nav-bar {
      width: 100%;
    }

    h1 {
      text-align: center;
    }

    h3 {
      display: block;
    }

    .legend {
      width: 100%;
      text-align: center;
      display: flex;
    }

    .red,
    .green,
    .yellow,
    .blue, 
    .purple {
      width: 20%;
      color: white;
    }

    .red {
      background-color: red;
    }

    .green {
      background-color: green;
    }

    .yellow {
      background-color: yellow;
      color: black;
    }
    .blue {
      background-color: blue;
    }
    .purple {
      background-color: purple;
    }
  </style>
    </head>
    <body>
    <div id="nav-bar">
    <h1>Cannibal Missionary Problem State Space Tree</h1>
    <div class="legend">
      <h2 class="red">Killed</h2>
      <h2 class="green">Explored</h2>
      <h2 class="yellow">Unexplored</h2>
      <h2 class="blue">Unexpandable</h2>
      <h2 class="purple">Goal State</h2>
      
    </div>
  </div>
      <div id="network-container"> 
        <div id="graph-container"></div>
      </div>
      <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
      <script>
        const container = document.getElementById('graph-container');
        const data = {
          nodes: ${JSON.stringify(
            nodes.map((node) => ({
              id: node.id,
              label: node.id,
              color:
                node.color == 1
                  ? "red"
                  : node.color == "0"
                  ? "green"
                  : node.color == "2"
                  ? "yellow"
                  : node.color == "3"
                  ? "blue"
                  : "purple",
              level: node.level,
            }))
          )},
          edges: ${JSON.stringify(weightedEdges)}
        };
        const options = {
      layout: {
        hierarchical: {
          direction: 'UD',
          sortMethod: 'directed',
          levelSeparation: 80,
          nodeSpacing: 150,
        }
      },
      physics: {
        enabled: false
      },
      nodes: {
        font: {
          size: 28,
          color: '#ffffff'
        }
      }
    };
        new vis.Network(container, data, options);
      </script>
    </body>
    </html>
  `;
}

module.exports = {
  createHtmlContent,
};
