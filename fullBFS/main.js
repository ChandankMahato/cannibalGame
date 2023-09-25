const fs = require("fs");
const { exec } = require("child_process");

let tree = [];
let from = [];
let to = [];
let weight = [];

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

  isSolution() {
    let solution = [];
    solution.push(this.action);
    let path = new Node(this.state, this.parent, this.action);
    while (path.parent != null) {
      path = path.parent;
      if (path.isKilled()) {
        return false;
      }
    }
    return true;
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
  while (!(q.length == 0)) {
    let node = q.shift();
    console.log(`\nThe node to expand is ${node.state}\n`);
    let children = node.generateChild();
    console.log(`The children of ${node.state}:`);
    for (const child of children) {
      if (child.isGoal()) {
        from.push([
          node.state,
          node.depth,
          node.parent == null ? "null" : node.parent.state,
        ]);
        to.push([child.state, child.depth, child.parent.state]);
        weight.push(child.action);
        console.log("\n");
        let isSolution = child.isSolution();

        if (!isSolution) {
          break;
        }
        return {
          solution: child.findSolution(),
          //   killedNodes: killed,
          //   opened: opened,
        };
      }
      if (child.depth > 3) {
        return {
          solution: "Solution not found",
        };
      }
      if (child.isValid()) {
        q.push(child);
        from.push([
          node.state,
          node.depth,
          node.parent == null ? "null" : node.parent.state,
        ]);
        to.push([child.state, child.depth, child.parent.state]);
        weight.push(child.action);
        // explored.push(child.state);
      }
    }
  }
}

let initialState = [3, 3, 1];
const res = bfs(initialState);
console.log(res);

for (let i = 0; i < to.length; i++) {
  let isSolution = false;
  for (const node of res["solution"]) {
    if (
      weight[i][0] == node[0] &&
      weight[i][1] == node[1] &&
      weight[i][2] == node[2]
    ) {
      isSolution = true;
      break;
    }
  }
  if (isSolution) {
    let appendData =
      JSON.stringify(from[i][0]) +
      "," +
      JSON.stringify(from[i][2]) +
      " " +
      JSON.stringify(to[i][0]) +
      "," +
      JSON.stringify(to[i][2]) +
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
    let appendData =
      JSON.stringify(from[i][0]) +
      "," +
      JSON.stringify(from[i][2]) +
      " " +
      JSON.stringify(to[i][0]) +
      "," +
      JSON.stringify(to[i][2]) +
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
  }
}

// function forFileWrite(arr) {
//   let convertedData = [];
//   for (data of arr) {
//     let converted = JSON.stringify(data) + ",";
//     convertedData.push(converted);
//   }
//   return convertedData;
// }

fs.writeFile("./fullBFS/data.txt", tree.join("").trim(), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("File write completed. Executing drawGraph.js...");
    exec("node ./fullBFS/drawGraph.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing drawGraph.js: ${error}`);
        return;
      }
      console.log(`drawGraph.js executed successfully.`);
    });
  }
});

// fs.writeFile(
//   "./UI/script.js",
//   createScriptFile(forFileWrite(res["solution"]).join("").trim()),
//   (err) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log("./script.js file created successfully.");
//     exec("start ./UI/index.html", (error) => {
//       if (error) {
//         console.error(`Error opening file: ${error}`);
//       }
//     });
//   }
// );
