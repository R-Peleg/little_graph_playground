import Graph from 'graphology';

export function greedyEdgeColoring(
  graph: Graph,
  n_colors: number,
  color_attr: string = 'color'
) {
  const colors = [...Array(n_colors).keys()];
  const edgeColors = new Map();
  const possibleColors = new Map();

  // Initialize possible colors for each edge
  graph.forEachEdge((edge) => {
    possibleColors.set(edge, new Set(colors));
  });

  // Process edges with a single available color first
  const edges = graph.edges();
  while (edgeColors.size < edges.length) {
    let singleChoiceEdge = null;

    for (const edge of edges) {
      if (!edgeColors.has(edge)) {
        const availableColors = possibleColors.get(edge);
        if (availableColors.size === 1) {
          singleChoiceEdge = edge;
          break;
        }
      }
    }

    // If no single-choice edge found, pick any remaining edge greedily
    const edgeToColor = singleChoiceEdge || edges.find(e => !edgeColors.has(e));
    if (!edgeToColor) break;

    const availableColors = possibleColors.get(edgeToColor);
    const availableColor = [...availableColors][0];

    if (availableColor === undefined) {
      throw new Error('Not enough colors available to color the graph');
    }

    edgeColors.set(edgeToColor, availableColor);
    graph.setEdgeAttribute(edgeToColor, color_attr, availableColor);
    
    const [source, target] = graph.extremities(edgeToColor);
    
    // Update possible colors for adjacent edges
    graph.forEachEdge(source, (adjEdge) => {
      if (adjEdge !== edgeToColor) possibleColors.get(adjEdge)?.delete(availableColor);
    });
    graph.forEachEdge(target, (adjEdge) => {
      if (adjEdge !== edgeToColor) possibleColors.get(adjEdge)?.delete(availableColor);
    });
  }
}
