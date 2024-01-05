
const fs = require("fs");
const { exec } = require("child_process");
const { createHtmlContent } = require("./createHTMLContent");
const {solveEightPuzzle } = require("./heuristics");
function solve() {
    const initial_state = [
        [2, 8, 3],
        [1, 6, 4],
        [7, 0, 5]
    ];
    const goal_state = [
        [1, 2, 3],
        [8, 0, 4],
        [7, 6, 5]
    ];
    const [nodes, edges] = solveEightPuzzle(initial_state, goal_state);
    const graph_data = {
        nodes: nodes,
        edges: edges
    };
    return graph_data;
}
const graph_data = solve();
const nodesArray = [];
graph_data.nodes.forEach(function (data, index) {
    var dataarray = JSON.parse(data.label);
    var fillcolor = data.color
    var textcolor = 'black';
    var strokecolor = 'white';
    var strokewidth = 10;
    var fontsize = 75;
    var svgwidth = 400;
    var svgheight = 400;
    var rectwidth = 133.33;
    var rectheight = 133.33;
    var svg = '<svg width="' + svgwidth + '" height="' + svgheight + '" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect x="0" y="0" width="' + rectwidth + '" height="' + rectheight + '" fill="' + fillcolor + '" stroke="' + strokecolor + '" stroke-width="' + strokewidth + '" />';
    svg += '<rect x="' + rectwidth + '" y="0" width="' + rectwidth + '" height="' + rectheight + '" fill="' + fillcolor + '" stroke="' + strokecolor + '" stroke-width="' + strokewidth + '" />';
    svg += '<rect x="' + (2 * rectwidth) + '" y="0" width="' + rectwidth + '" height="' + rectheight + '" fill="' + fillcolor + '" stroke="' + strokecolor + '" stroke-width="' + strokewidth + '" />';
    svg += '<rect x="0" y="' + rectheight + '" width="' + rectwidth + '" height="' + rectheight + '" fill="' + fillcolor + '" stroke="' + strokecolor + '" stroke-width="' + strokewidth + '" />';
    svg += '<rect x="' + rectwidth + '" y="' + rectheight + '" width="' + rectwidth + '" height="' + rectheight + '" fill="' + fillcolor + '" stroke="' + strokecolor + '" stroke-width="' + strokewidth + '" />';
    svg += '<rect x="' + (2 * rectwidth) + '" y="' + rectheight + '" width="' + rectwidth + '" height="' + rectheight + '" fill="' + fillcolor + '" stroke="' + strokecolor + '" stroke-width="' + strokewidth + '" />';
    svg += '<rect x="0" y="' + (2 * rectheight) + '" width="' + rectwidth + '" height="' + rectheight + '" fill="' + fillcolor + '" stroke="' + strokecolor + '" stroke-width="' + strokewidth + '" />';
    svg += '<rect x="' + rectwidth + '" y="' + (2 * rectheight) + '" width="' + rectwidth + '" height="' + rectheight + '" fill="' + fillcolor + '" stroke="' + strokecolor + '" stroke-width="' + strokewidth + '" />';
    svg += '<rect x="' + (2 * rectwidth) + '" y="' + (2 * rectheight) + '" width="' + rectwidth + '" height="' + rectheight + '" fill="' + fillcolor + '" stroke="' + strokecolor + '" stroke-width="' + strokewidth + '" />';
    svg += '<text x="' + (rectwidth / 2) + '" y="' + (rectheight / 2) + '" font-size="' + fontsize + '" text-anchor="middle" fill="' + textcolor + '">' + dataarray[0][0] + '</text>';
    svg += '<text x="' + (rectwidth + (rectwidth / 2)) + '" y="' + (rectheight / 2) + '" font-size="' + fontsize + '" text-anchor="middle" fill="' + textcolor + '">' + dataarray[0][1] + '</text>';
    svg += '<text x="' + ((2 * rectwidth) + (rectwidth / 2)) + '" y="' + (rectheight / 2) + '" font-size="' + fontsize + '" text-anchor="middle" fill="' + textcolor + '">' + dataarray[0][2] + '</text>';
    svg += '<text x="' + (rectwidth / 2) + '" y="' + (rectheight + (rectheight / 2)) + '" font-size="' + fontsize + '" text-anchor="middle" fill="' + textcolor + '">' + dataarray[1][0] + '</text>';
    svg += '<text x="' + (rectwidth + (rectwidth / 2)) + '" y="' + (rectheight + (rectheight / 2)) + '" font-size="' + fontsize + '" text-anchor="middle" fill="' + textcolor + '">' + dataarray[1][1] + '</text>';
    svg += '<text x="' + ((2 * rectwidth) + (rectwidth / 2)) + '" y="' + (rectheight + (rectheight / 2)) + '" font-size="' + fontsize + '" text-anchor="middle" fill="' + textcolor + '">' + dataarray[1][2] + '</text>';
    svg += '<text x="' + (rectwidth / 2) + '" y="' + ((2 * rectheight) + (rectheight / 2)) + '" font-size="' + fontsize + '" text-anchor="middle" fill="' + textcolor + '">' + dataarray[2][0] + '</text>';
    svg += '<text x="' + (rectwidth + (rectwidth / 2)) + '" y="' + ((2 * rectheight) + (rectheight / 2)) + '" font-size="' + fontsize + '" text-anchor="middle" fill="' + textcolor + '">' + dataarray[2][1] + '</text>';
    svg += '<text x="' + ((2 * rectwidth) + (rectwidth / 2)) + '" y="' + ((2 * rectheight) + (rectheight / 2)) + '" font-size="' + fontsize + '" text-anchor="middle" fill="' + textcolor + '">' + dataarray[2][2] + '</text>';
    svg += '</svg>';
    nodesArray.push({
        id: data.id,
        shape: 'image',
        image: 'data:image/svg+xml;base64,' + btoa(svg),
        level: data.level,
        label: data.hValue
    });
});
var data = {
    nodes: nodesArray,
    edges: graph_data.edges,
};
fs.writeFile(
  "./Heuristics/heuristics.html",
  createHtmlContent(data),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("./heuristics.html file created successfully.");
    exec("start ./Heuristics/heuristics.html", (error) => {
      if (error) {
        console.error(`Error opening file: ${error}`);
      }
    });
  }
);
