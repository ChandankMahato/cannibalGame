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

    let boat_move = "from left to right";

    if (this.state[2] == 0) {
      op = 1;
      boat_move = "from right to left";
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
    let path = new Node(this.state, this.parent, this.action, this.depth);
    while (path.parent != null) {
      path = path.parent;
      solution.push(path.action);
    }
    // solution = solution.splice(-1);
    solution.pop();
    solution.reverse();
    for (const each of solution) {
      console.log(each);
    }
    // console.log("hi");
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
  // let killed = [];
  console.log(`The starting node is \ndepth = ${startNode.depth}`);
  console.log(startNode.state);
  while (!(q.length == 0)) {
    let node = q.shift();
    console.log(
      `\nthe node selected to expand is\ndepth=${node.depth}\n${node.state}\n`
    );
    explored.push(node.state);
    if (node.parent != null) {
    }
    let children = node.generateChild();
    if (!node.isKilled()) {
      console.log(`the children nodes of this node are`);
      for (const child of children) {
        if (!existsIn(explored, child.state)) {
          console.log(`depth = ${child.depth}`);
          console.log(child.state);
          if (child.isGoal()) {
            console.log("which is the goal state\n");
            return child.findSolution();
          }
          if (child.isValid()) {
            q.push(child);
            explored.push(child.state);
          }
        }
      }
    }
  }
}

let initialState = [3, 3, 1];
solution = bfs(initialState);
console.log(solution);
