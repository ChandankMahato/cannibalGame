const fs = require("fs");
const { exec } = require("child_process");
tree = [];

from = [];
to = [];
weight = [];

class Node {
  constructor(state, parent, action, depth) {
    this.parent = parent;
    this.state = state;
    this.action = action;
    this.depth = depth;
  }

  isGoal() {
    if (this.state[0] == 0 && this.state[1] == 0 && this.state[2] == 0) {
      return true;
    }
    return false;
  }

  isValid() {
    let missionaries = this.state[0];
    let cannibals = this.state[1];
    let boat = this.state[2];

    if (missionaries < 0 || missionaries > 3) {
      return false;
    }
    if (cannibals < 0 || cannibals > 3) {
      return false;
    }
    if (boat > 1 || boat < 0) {
      return false;
    }
    return true;
  }

  isKilled() {
    let missionaries = this.state[0];
    let cannibals = this.state[1];

    if (missionaries < cannibals && missionaries > 0) {
      return true;
    }
    if (missionaries > cannibals && missionaries < 3) {
      return true;
    }
  }

  generateChild() {
    let children = [];

    let depth = this.depth + 1;

    let op = -1;

    if (this.state[2] == 0) {
      op = 1;
    }

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        let newState = this.state.slice();
        newState[0] = newState[0] + op * x;
        newState[1] = newState[1] + op * y;
        newState[2] = newState[2] + op * 1;

        let action = [x, y, op];

        const newNode = new Node(newState, this, action, depth);

        if (x + y >= 1 && x + y <= 2) {
          children.push(newNode);
        }
      }
    }
    return children;
  }

  findSolution() {
    let solution = [];
    solution.push(this.action);
    let path = new Node(this.state, this.parent, this.action);
    while (path.parent != null) {
      path = path.parent;
      solution.push(path.action);
    }
    solution.pop();
    solution.reverse();
    return solution;
  }
}

function existsIn(main, check) {
  for (i = 0; i < main.length; i++) {
    if (
      main[i][0] == check[0] &&
      main[i][1] == check[1] &&
      main[i][2] == check[2]
    ) {
      return true;
    }
  }
  return false;
}

function bfs(initialState) {
  let startNode = new Node(initialState, null, null, 0);

  if (startNode.isGoal()) {
    return startNode.findSolution();
  }

  q = [];
  q.push(startNode);
  let explored = [];
  let killed = [];
  let opened = [];
  console.log(startNode.state);
  while (!(q.length == 0)) {
    let node = q.shift();
    console.log(`\nThe node to expand is ${node.state}\n`);
    explored.push(node.state);
    let children = node.generateChild();
    if (!node.isKilled()) {
      opened.push(node.state);
      console.log(`The children of ${node.state}:`);
      for (const child of children) {
        if (!existsIn(explored, child.state)) {
          console.log(child.state);
          if (child.isGoal()) {
            from.push([node.state, node.depth]);
            to.push([child.state, child.depth]);
            weight.push(child.action);
            console.log("\n");
            return {
              solution: child.findSolution(),
              killedNodes: killed,
              opened: opened,
            };
          }
          if (child.isValid()) {
            q.push(child);
            from.push([node.state, node.depth]);
            to.push([child.state, child.depth]);
            weight.push(child.action);
            explored.push(child.state);
          }
        }
      }
    } else {
      killed.push(node.state);
    }
  }
}

let initialState = [3, 3, 1];
const res = bfs(initialState);
// console.log(res["solution"]);

for (let i = 0; i < to.length; i++) {
  let contains = false;
  for (const node of res["killedNodes"]) {
    if (
      to[i][0][0] == node[0] &&
      to[i][0][1] == node[1] &&
      to[i][0][2] == node[2]
    ) {
      contains = true;
      break;
    }
  }
  if (contains) {
    let appendData =
      JSON.stringify(from[i][0]) +
      " " +
      JSON.stringify(to[i][0]) +
      " " +
      JSON.stringify(weight[i]) +
      " " +
      "1" +
      " " +
      JSON.stringify(from[i][1]) +
      " " +
      JSON.stringify(to[i][1]) +
      "\n";
    tree.push(appendData);
  } else {
    let explored = true;
    // for (const node of res["opened"]) {
    //   if (to[i][0] == node[0] && to[i][1] != node[1] && to[i][2] != node[2]) {
    //     explored = false;
    //     break;
    //   }
    // }
    if (
      existsIn(res["opened"], to[i][0]) ||
      (to[i][0][0] == "0" && to[i][0][1] == "0" && to[i][0][2] == "0")
    ) {
      let appendData =
        JSON.stringify(from[i][0]) +
        " " +
        JSON.stringify(to[i][0]) +
        " " +
        JSON.stringify(weight[i]) +
        " " +
        "0" +
        " " +
        JSON.stringify(from[i][1]) +
        " " +
        JSON.stringify(to[i][1]) +
        "\n";
      tree.push(appendData);
    } else {
      let appendData =
        JSON.stringify(from[i][0]) +
        " " +
        JSON.stringify(to[i][0]) +
        " " +
        JSON.stringify(weight[i]) +
        " " +
        "2" +
        " " +
        JSON.stringify(from[i][1]) +
        " " +
        JSON.stringify(to[i][1]) +
        "\n";
      tree.push(appendData);
    }
  }
}

function forFileWrite(arr) {
  let convertedData = [];
  for (data of arr) {
    let converted = JSON.stringify(data) + "\n";
    convertedData.push(converted);
  }
  return convertedData;
}

fs.writeFile("./StateSpace/data.txt", tree.join("").trim(), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("File write completed. Executing drawGraph.js...");
    exec("node ./StateSpace/drawGraph.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing drawGraph.js: ${error}`);
        return;
      }
      console.log(`drawGraph.js executed successfully.`);
    });
  }
});

fs.writeFile(
  "./StateSpace/solution.txt",
  forFileWrite(res["solution"]).join("").trim(),
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("File write completed. Executing Game....");
    }
  }
);
