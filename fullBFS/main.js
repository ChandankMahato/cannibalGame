const fs = require("fs");

let tree = [];
let from = [];
let to = [];
let weight = [];
const freezeTime = 100;
const maxDepth = 4;
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
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
  mustBeKilled() {
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
    let canoe = -1;
    if (this.state[2] == 0) {
      canoe = 1;
    }

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        let newState = this.state.slice();
        newState[0] = newState[0] + canoe * x;
        newState[1] = newState[1] + canoe * y;
        newState[2] = newState[2] + canoe * 1;
        let action = [x, y, canoe];
        const newNode = new Node(newState, this, action, this.depth + 1);
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

    // Move up the tree
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
      if (path.mustBeKilled()) {
        return false;
      }
    }
    return true;
  }
}
async function bfs(initialState) {
  let startNode = new Node(initialState, null, null, 0);
  if (startNode.isGoal()) {
    return startNode.findSolution();
  }
  q = [];
  q_states = [];
  console.log(`The initial state is ${startNode.state}`);
  q.push(startNode);
  q_states.push(startNode.state);
  while (!(q.length == 0)) {
    let node = q.shift();
    q_states.shift();

    console.log(`\nThe node to expand is ${node.state}\n`);
    let children = node.generateChild();
    console.log(`The valid children of ${node.state}:`);
    let count = 0;
    for (const child of children) {
      if (child.depth > maxDepth) {
        console.log(
          "\x1b[31m",
          `\n Max depth limit reached which was ${maxDepth}.`
        );
        return {
          solution: "Solution not found",
        };
      }
      if (child.isValid()) {
        count++;
        q.push(child);
        q_states.push(child.state);
        from.push([node.state, node.depth]);
        to.push([child.state, child.depth]);
        weight.push(child.action);
        console.log(child.state);
        if (child.isGoal()) {
          console.log("\nGoal State Found");
          console.log("Checking if it is our solution...");
          let isSolution = child.isSolution();
          if (!isSolution) {
            console.log(
              "\nThe path that leads to the goal state is not a valid solution\n"
            );
          } else {
            console.log(
              "\nThe path that leads to the goal state is a valid solution\n"
            );
            return {
              solution: child.findSolution(),
            };
          }
        }
      }
    }
    if (count === 0) {
      console.log("The node cannot be further expanded");
    }
  }
}
async function fullBfsSolutionAndDataSaver() {
  let initialState = [3, 3, 1];
  const res = await bfs(initialState);
  if (res["solution"] == "Solution not found") {
    console.log("\x1b[31m", res["solution"]);
    console.log("\x1b[37m");
  } else {
    console.log("Solution:");
    console.log(res["solution"]);
  }
  for (let i = 0; i < to.length; i++) {
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
  }
  function forSolutionWrite(arr) {
    let convertedData = [];
    for (data of arr) {
      let converted = JSON.stringify(data) + "\n";
      convertedData.push(converted);
    }
    return convertedData;
  }
  fs.writeFile("./fullBFS/data.txt", tree.join("").trim(), (err) => {
    if (err) console.error(err);
  });
  fs.writeFile(
    "./solution/solFullBFS.txt",
    res["solution"] == "Solution not found"
      ? "Solution not found"
      : forSolutionWrite(res["solution"]).join("").trim(),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

fullBfsSolutionAndDataSaver();
