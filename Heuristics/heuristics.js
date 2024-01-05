
class EightPuzzleState {
    constructor(state, parent = null, move = null, level = 0) {
        this.state = state;
        this.parent = parent;
        this.move = move;
        this.level = level;
    }
    toString() {
        return JSON.stringify(this.state);
    }
    isEqual(other) {
        return JSON.stringify(this.state) === JSON.stringify(other.state);
    }
    hash() {
        return JSON.stringify(this.state);
    }
    isGoal(goalState) {
        return JSON.stringify(this.state) === JSON.stringify(goalState);
    }
    getPossibleMoves() {
        const moves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.state[i][j] === 0) {
                    if (j > 0) moves.push([0, -1]); // Move Left
                    if (i < 2) moves.push([1, 0]); // Move Down
                    if (i > 0) moves.push([-1, 0]); // Move Up
                    if (j < 2) moves.push([0, 1]); // Move Right
                }
            }
        }
        return moves;
    }
    generateChild(move) {
        const newState = this.state.map(row => [...row]);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.state[i][j] === 0) {
                    const [ni, nj] = [i + move[0], j + move[1]];
                    [newState[i][j], newState[ni][nj]] = [newState[ni][nj], newState[i][j]];
                }
            }
        }
        return new EightPuzzleState(newState, this, move, this.level + 1);
    }
}
function calculateMisplacedTiles(currentState, goalState) {
    let misplaced = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (currentState[i][j] !== goalState[i][j]) {
                misplaced++;
            }
        }
    }
    return misplaced;
}
function solveEightPuzzle(initialState, goalState) {
    const queue = [];
    const visited = new Set();

    const initialNode = new EightPuzzleState(initialState);
    queue.push(initialNode);
    visited.add(JSON.stringify(initialState));

    const nodes = [];
    const edges = [];
    const hValue = calculateMisplacedTiles(initialNode.state, goalState);
    nodes.push({
        color: 'green',
        id: JSON.stringify(initialNode.state),
        label: JSON.stringify(initialNode.state),
        level: initialNode.level,
        hValue: `g=${initialNode.level}, h=${hValue}, f=${initialNode.level + hValue}`,
    });
    while (queue.length) {
        const currentNode = queue.shift();

        if (currentNode.isGoal(goalState)) {
            break;
        }
        const siblings = [];
        for (const move of currentNode.getPossibleMoves()) {
            const childNode = currentNode.generateChild(move);
            const childStateString = JSON.stringify(childNode.state);
            if (!visited.has(childStateString)) {
                nodes.push({
                    color: childNode.isGoal(goalState) ? 'green' : 'red',
                    id: childStateString,
                    label: childStateString,
                    level: childNode.level,
                    hValue: `g=${childNode.level}, h=${calculateMisplacedTiles(childNode.state, goalState)}, f=${
                        childNode.level + calculateMisplacedTiles(childNode.state, goalState)
                    }`,
                });
                edges.push({
                    arrows: 'to',
                    from: JSON.stringify(currentNode.state),
                    to: childStateString,
                });
                visited.add(childStateString);
                siblings.push(childNode);
            }
        }
        if (siblings.length > 0) {
            const minSibling = siblings.reduce((minNode, node) => {
                const minMisplacedTiles = calculateMisplacedTiles(minNode.state, goalState);
                const nodeMisplacedTiles = calculateMisplacedTiles(node.state, goalState);
                return nodeMisplacedTiles < minMisplacedTiles ? node : minNode;
            });
            for (const nodeData of nodes) {
                if (nodeData.id === JSON.stringify(minSibling.state)) {
                    nodeData.color = 'green';
                }
                if (nodeData.id === JSON.stringify(goalState)) {
                    nodeData.color = 'green';
                }
            }
            queue.push(minSibling);
        }
    }
    return [nodes, edges];
}
module.exports = {
  solveEightPuzzle
};
