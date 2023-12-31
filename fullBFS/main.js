const fs = require("fs");

// Nodes of our state space tree
let tree = [];

// Each state and step
let from = [];
let to = [];
let weight = [];

const freezeTime = 100;
const maxDepth = 4;

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
  /**
   * Since, we are using Brute Fore searching,
   * We need to check whether the solution is reached by a path of valid states or not
   */
  isSolution() {
    let solution = [];
    solution.push(this.action);
    let path = new Node(this.state, this.parent, this.action);
    while (path.parent != null) {
      path = path.parent;
      // If any of the state in the solution must actually be killed
      if (path.mustBeKilled()) {
        // Then not our desired solution
        return false;
      }
    }
    return true;
  }
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
  q = [];

  // BFS Queue for states only
  q_states = [];
  console.log(`The initial state is ${startNode.state}`);
  q.push(startNode);
  q_states.push(startNode.state);

  // Until the BFS queue is empty
  while (!(q.length == 0)) {
    // console.log(`\nBFS Queue: ${JSON.stringify(q_states)}`);
    // await delay(freezeTime).then(() => {});

    // Take the first element from the queue
    let node = q.shift();
    q_states.shift();

    console.log(`\nThe node to expand is ${node.state}\n`);
    // await delay(freezeTime).then(() => {});

    // Generate the child for the element
    let children = node.generateChild();
    console.log(`The valid children of ${node.state}:`);
    // await delay(freezeTime).then(() => {});

    // Count keeps track of the number of valid children of a state
    let count = 0;

    for (const child of children) {
      // If the given maxDepth is reached
      if (child.depth > maxDepth) {
        // await delay(freezeTime).then(() => {});
        console.log(
          "\x1b[31m",
          `\n Max depth limit reached which was ${maxDepth}.`
        );

        // Return solution not found
        return {
          solution: "Solution not found",
        };
      }

      // If the child is valid
      if (child.isValid()) {
        // Update the counter and push it into the relevant lists
        count++;
        q.push(child);
        q_states.push(child.state);
        from.push([node.state, node.depth]);
        to.push([child.state, child.depth]);
        weight.push(child.action);
        console.log(child.state);

        // If the child is our goal state
        if (child.isGoal()) {
          console.log("\nGoal State Found");
          console.log("Checking if it is our solution...");
          // await delay(freezeTime).then(() => {});

          // Check if our solution is a valid solution
          let isSolution = child.isSolution();

          // If not
          if (!isSolution) {
            console.log(
              "\nThe path that leads to the goal state is not a valid solution\n"
            );
            // await delay(freezeTime).then(() => {});

            // break;
          } else {
            console.log(
              "\nThe path that leads to the goal state is a valid solution\n"
            );
            // await delay(freezeTime).then(() => {});
            return {
              solution: child.findSolution(),
            };
          }
        }
      }
      // await delay(freezeTime).then(() => {});
    }

    // If counter is 0, it indicates that the current node cannot be further expanded since it has no valid children
    if (count === 0) {
      console.log("The node cannot be further expanded");
      // await delay(freezeTime).then(() => {});
    }
  }
}

// Main function
async function fullBfsSolutionAndDataSaver() {
  // Define the initial state and call the bfs algorithm
  let initialState = [3, 3, 1];
  const res = await bfs(initialState);
  if (res["solution"] == "Solution not found") {
    console.log("\x1b[31m", res["solution"]);
    console.log("\x1b[37m");
  } else {
    console.log("Solution:");
    console.log(res["solution"]);
  }

  // For each node in the to list (from --action--> to)
  for (let i = 0; i < to.length; i++) {
    // Append the the nodes to the graph data
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

  // Write the graph data into data.txt. Graph too big to draw
  fs.writeFile("./fullBFS/data.txt", tree.join("").trim(), (err) => {
    if (err) console.error(err);
  });

  // Write the solution into solFullBFS.txt
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
