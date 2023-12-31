const fs = require("fs");
const { exec } = require("child_process");
const { createScriptFile } = require("./UI");

// Nodes of our state space tree
let tree = [];

// Each state and step
let from = [];
let to = [];
let weight = [];

const freezeTime = 100;

// Freezes the program for given amount of time
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Class Node
 * Represents each state of the game
 * Each Node objects stores it's state, parent node, the step from parent and it's depth in the state space tree
 */
class Node {
  constructor(state, parent, action, depth) {
    this.parent = parent;
    this.state = state;
    this.action = action;
    this.depth = depth;
  }

  /**
   * Checks if the given state is the goal state or not
   */
  isGoal() {
    if (this.state[0] == 0 && this.state[1] == 0 && this.state[2] == 0) {
      return true;
    }
    return false;
  }

  /**
   * Checks if the given state is a valid state or not
   * For eg: Less than 0 or more than 3 missionaries/cannibals is an invalid state
   */
  isValid() {
    let missionaries = this.state[0];
    let cannibals = this.state[1];
    let boat = this.state[2];

    // More than 3 or less than 0 missionaries
    if (missionaries < 0 || missionaries > 3) {
      return false;
    }

    // More than 3 or less than 0 cannibals
    if (cannibals < 0 || cannibals > 3) {
      return false;
    }

    // Boat other than left/right(1/0)
    if (boat > 1 || boat < 0) {
      return false;
    }

    // If no invalid states
    return true;
  }

  /**
   * Checks if the given state can be killed
   * For eg: States where cannibal > missionaries can be killed
   */
  mustBeKilled() {
    let missionaries = this.state[0];
    let cannibals = this.state[1];

    // If missionaries and cannibals exists and missionaries count is less than cannibals
    if (missionaries < cannibals && missionaries > 0) {
      return true;
    }

    // If on the left side, missionaries are more than cannibals but there aren't all of the missionaries
    // For eg: 1C, 2M on the left means 2C, 1M on the right.
    if (missionaries > cannibals && missionaries < 3) {
      return true;
    }
  }

  /**
   * Generates all the possible children for a node
   */
  generateChild() {
    let children = [];

    // Initially cosider the canoe is on the left i.e 1
    // So for the next move the canoe has be on the right i.e 0
    let canoe = -1;

    // If canoe is on the right
    if (this.state[2] == 0) {
      canoe = 1;
    }

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        // Can't directly set this.state since javascript does copy by reference for non primitive types
        let newState = this.state.slice();

        // Create new state for all possible combination of crossing the river (0, 1, 2)M and (0, 1, 2)C
        newState[0] = newState[0] + canoe * x;
        newState[1] = newState[1] + canoe * y;
        newState[2] = newState[2] + canoe * 1;

        // The step taken to get to new state
        let action = [x, y, canoe];

        const newNode = new Node(newState, this, action, this.depth + 1);

        // Since the canoe has to have atlease 1 and at most 2 people
        // We filter out all the other states that doesnot satisfy our criteria
        if (x + y >= 1 && x + y <= 2) {
          children.push(newNode);
        }
      }
    }
    return children;
  }

  /**
   * Starting from the given node(solution), moves up the state space tree to the root
   * Returns the path from root to the solution
   */
  findSolution() {
    let solution = [];
    solution.push(this.action);
    let path = new Node(this.state, this.parent, this.action);
    // Move up the tree
    while (path.parent != null) {
      path = path.parent;
      solution.push(path.action);
    }
    // Since the action that generated the root is null, we pop it out
    solution.pop();

    // The path is currently stored in reverse, so we reverse so that it starts from root and ends at the solution
    solution.reverse();
    return solution;
  }
}

/**
 * Checks if the given state check, exists in a given set of states main
 */
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

/**
 * The BFS Algorithm
 */
async function bfs(initialState) {
  let startNode = new Node(initialState, null, null, 0);

  if (startNode.isGoal()) {
    return startNode.findSolution();
  }

  // BFS Queue
  let q = [];

  // BFS Queue for states only
  let q_states = [];
  q.push(startNode);
  q_states.push(startNode.state);

  // Tracking the states that are explored(all), killed and opened(expanded)
  let explored = [];
  let killed = [];
  let opened = [];
  console.log(`The initial state is ${startNode.state}`);

  // Until the BFS queue is empty
  while (!(q.length == 0)) {
    console.log(`\nBFS Queue: ${JSON.stringify(q_states)}`);
    await delay(freezeTime).then(() => {});

    // Take the first element from the queue
    let node = q.shift();
    q_states.shift();

    console.log(`\nThe node to expand is ${node.state}\n`);
    await delay(freezeTime).then(() => {});

    // Push it into the explored list
    explored.push(node.state);

    // Generate the child for the element
    let children = node.generateChild();

    // If the node does not have to be killed
    if (!node.mustBeKilled()) {
      // Push it into the opened list
      opened.push(node.state);
      console.log(`The valid children of ${node.state}:`);
      await delay(freezeTime).then(() => {});

      // Count keeps track of the number of valid children of a state
      let count = 0;

      for (const child of children) {
        // If a child doesnot already exists in the explored list
        if (!existsIn(explored, child.state)) {
          // If the child is valid
          if (child.isValid()) {
            // Update the counter and push it into the relevant lists
            count++;
            q.push(child);
            q_states.push(child.state);
            from.push([node.state, node.depth]);
            to.push([child.state, child.depth]);
            weight.push(child.action);
            explored.push(child.state);
            console.log(child.state);

            // If the child is our goal state
            if (child.isGoal()) {
              console.log("Goal State Found");
              await delay(freezeTime).then(() => {});
              console.log("\n");

              // Find the solution path and return it along with killedNodes and opened nodes for generating graph
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
      // If counter is 0, it indicates that the current node cannot be further expanded since it has no valid children
      if (count === 0) {
        console.log("The node cannot be further expanded");
        await delay(freezeTime).then(() => {});
      }
    } else {
      // If the node is to be killed
      killed.push(node.state);
      console.log(
        "The state as respresented by this node is not possible. So it is killed."
      );
      await delay(freezeTime).then(() => {});
    }
  }
}

// Main function
async function bfsSolutionAndDataSaver() {
  // Define the initial state and call the bfs algorithm
  let initialState = [3, 3, 1];
  const res = await bfs(initialState);
  console.log("Solution:");
  console.log(res["solution"]);

  // For each node in the to list (from --action--> to)
  for (let i = 0; i < to.length; i++) {
    let contains = false;
    // Check if the node exists in the list of killed nodes
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
    // If the node exists in the killed nodes append it to the graph data with a color value of 1(red)
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
      // If the node doesnot exist in the killed nodes
      // Check if the node has been opened or is the solution
      // If yes, append it to the graph data with a colour of 0(green)
      // Else, append it to the graph data with a colour of 2(yellow)(unexplored)
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

  /**
   * Formats the given solution into an appropriate format for game
   */
  function forFileWrite(arr) {
    let convertedData = [];
    for (data of arr) {
      let converted = JSON.stringify(data) + ",";
      convertedData.push(converted);
    }
    return convertedData;
  }
  /**
   * Formats the given solution into an appropriate format for storing
   */
  function forSolutionWrite(arr) {
    let convertedData = [];
    for (data of arr) {
      let converted = JSON.stringify(data) + "\n";
      convertedData.push(converted);
    }
    return convertedData;
  }

  // Write the graph data into data.txt and draw the graph
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

  // Generate script for the game and run it using our solution
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

  // Write the solution into sol.txt
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
