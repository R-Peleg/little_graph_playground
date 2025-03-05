import React from 'react';
import GraphPlotter from './GraphPlotter';
import { UndirectedGraph, DirectedGraph } from 'graphology'
import { greedyEdgeColoring } from '@/algo/edge_coloring';

// Define the props for the component
export interface ColorCyclePlotterProps {
  graph: UndirectedGraph;
}

const decomposeIntoCycles = (graph: UndirectedGraph): DirectedGraph[] => {
  const digraph = new DirectedGraph();
  graph.forEachNode((node, attributes) => digraph.addNode(node, attributes));
  graph.forEachEdge((edge, attrs, source, target) => {
    digraph.addEdgeWithKey(`${source}->${target}`, source, target, attrs);
    digraph.addEdgeWithKey(`${target}->${source}`, target, source, attrs);
  });
  const cycles: DirectedGraph[] = [];
  const visitedEdges = new Set();
  const allColors = graph.edges().map(edge => graph.getEdgeAttribute(edge, 'color'));
  const distColors = [...new Set(allColors)];

  const getNextEdge = (node: string, color: number) => {
    const edges = digraph.outEdges(node);
    for (const edge of edges) {
      const [source, target] = digraph.extremities(edge);
      const edgeColor = digraph.getDirectedEdgeAttribute(source, target, 'color');
      if (edgeColor === color) {
        return edge;
      }
    }
    return null;
  };

  digraph.forEachEdge((edge, attributes, source, target) => {
    if (visitedEdges.has(edge)) {
      return;
    }
    const cycle = new DirectedGraph();
    digraph.forEachNode((node, attributes) => cycle.addNode(node, attributes));
    let currentEdge = edge;
    let currentNode = source;
    let currentColor = distColors.findIndex(c => c == attributes.color);

    while (currentEdge && !visitedEdges.has(currentEdge)) {
      if (visitedEdges.has(currentEdge)) {
        break;
      }
      visitedEdges.add(currentEdge);
      const nextNode = digraph.opposite(currentNode, currentEdge);
      const currentEdgeAttributes = digraph.getEdgeAttributes(currentEdge);
      cycle.addEdgeWithKey(currentEdge, currentNode, nextNode, currentEdgeAttributes);
      currentNode = nextNode;
      currentColor = (currentColor + 1) % 3;
      const nextEdge = getNextEdge(currentNode, distColors[currentColor]);
      if (!nextEdge) break;
      currentEdge = nextEdge;
    }
    cycle.forEachNode((node, attributes) => {
      console.log(node, attributes);
    });

    cycles.push(cycle);
  });

  return cycles;
};

const ColorCyclePlotter: React.FC<ColorCyclePlotterProps> = ({ graph }) => {
  const coloredGraph = graph.copy();
  greedyEdgeColoring(coloredGraph, 3);
  coloredGraph.forEachEdge((edge, attributes, source, target) => {
    const edge_color_num = coloredGraph.getUndirectedEdgeAttribute(source, target, 'color') as number;
    const edge_color = { 0: 'red', 1: 'green', 2: 'blue' }[edge_color_num];
    coloredGraph.setEdgeAttribute(edge, 'color', edge_color);
  });
  const cycles = decomposeIntoCycles(coloredGraph);
  return (
    <div>
        <p>Graph Coloring</p>
        <GraphPlotter
            graph={coloredGraph}
        />
        <div>
          <h3>Cycles</h3>
          {cycles.map((cycle, index) => (
            <div key={index}>
              <p>Cycle {index + 1}:</p>
              <GraphPlotter
                graph={cycle}
                height={250}
                width={300}
              />
            </div>
          ))}
        </div>
    </div>
  );
};

export default ColorCyclePlotter;
