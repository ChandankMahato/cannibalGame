const fs = require("fs");
const { exec } = require("child_process");
const { createScriptFile } = require("./UI");

let tree = [];
let from = [];
let to = [];
let weight = [];

const freezeTime = 100;
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
async function bfs(initialState) {
  let startNode = new Node(initialState, null, null, 0);

  if (startNode.isGoal()) {
    return startNode.findSolution();
  }
  let q = [];
  let q_states = [];
  q.push(startNode);
  q_states.push(startNode.state);
  let explored = [];
  let killed = [];
  let opened = [];
  console.log(`The initial state is ${startNode.state}`);
  while (!(q.length == 0)) {
    console.log(`\nBFS Queue: ${JSON.stringify(q_states)}`);
    await delay(freezeTime).then(() => {});
    let node = q.shift();
    q_states.shift();
    console.log(`\nThe node to expand is ${node.state}\n`);
    await delay(freezeTime).then(() => {});
    explored.push(node.state);
    let children = node.generateChild();
    if (!node.mustBeKilled()) {
      opened.push(node.state);
      console.log(`The valid children of ${node.state}:`);
      await delay(freezeTime).then(() => {});
      let count = 0;
      for (const child of children) {
        if (!existsIn(explored, child.state)) {
          if (child.isValid()) {
            count++;
            q.push(child);
            q_states.push(child.state);
            from.push([node.state, node.depth]);
            to.push([child.state, child.depth]);
            weight.push(child.action);
            explored.push(child.state);
            console.log(child.state);
            if (child.isGoal()) {
              console.log("Goal State Found");
              await delay(freezeTime).then(() => {});
              console.log("\n");
              return {
                solution: child.findSolution(),
                killedNodes: killed,
                opened: opened,
              };
            }
          }

          await delay(freezeTime).then(() => {});
        }
      }
      if (count === 0) {
        console.log("The node cannot be further expanded");
        await delay(freezeTime).then(() => {});
      }
    } else {
      killed.push(node.state);
      console.log(
        "The state as respresented by this node is not possible. So it is killed."
      );
      await delay(freezeTime).then(() => {});
    }
  }
}
async function bfsSolutionAndDataSaver() {
  let initialState = [3, 3, 1];
  const res = await bfs(initialState);
  console.log("Solution:");
  console.log(res["solution"]);
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
      let converted = JSON.stringify(data) + ",";
      convertedData.push(converted);
    }
    return convertedData;
  }
  function forSolutionWrite(arr) {
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
    "./UI/script.js",
    createScriptFile(forFileWrite(res["solution"]).join("").trim()),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("./script.js file created successfully.");
      exec("start ./UI/index.html", (error) => {
        if (error) {
          console.error(`Error opening file: ${error}`);
        }
      });
    }
  );
  fs.writeFile(
    "./solution/sol.txt",
    forSolutionWrite(res["solution"]).join("").trim(),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

bfsSolutionAndDataSaver();
