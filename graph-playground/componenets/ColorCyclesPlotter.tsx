import React from 'react';
import GraphPlotter, { GraphEdge, GraphNode } from './GraphPlotter';
import { UndirectedGraph, DirectedGraph } from 'graphology'
import { greedyEdgeColoring } from '@/algo/edge_coloring';

// Define the props for the component
export interface ColorCyclePlotterProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const decomposeIntoCycles = (graph: UndirectedGraph): DirectedGraph[] => {
  const digraph = new DirectedGraph();
  graph.forEachNode(node => digraph.addNode(node));
  graph.forEachEdge((edge, attrs, source, target) => {
    digraph.addEdgeWithKey(`${source}->${target}`, source, target, attrs);
    digraph.addEdgeWithKey(`${target}->${source}`, target, source, attrs);
  });
  const cycles: DirectedGraph[] = [];
  const visitedEdges = new Set();

  const getNextEdge = (node: string, color: number) => {
    const edges = digraph.outEdges(node);
    for (const edge of edges) {
      const [source, target] = digraph.extremities(edge);
      const edgeColor = digraph.getDirectedEdgeAttribute(source, target, 'color');
      if (edgeColor === color && !visitedEdges.has(edge)) {
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
    digraph.forEachNode(node => cycle.addNode(node));
    let currentEdge = edge;
    let currentNode = source;
    let currentColor = attributes.color;

    while (currentEdge && !visitedEdges.has(currentEdge)) {
      if (visitedEdges.has(currentEdge)) {
        break;
      }
      visitedEdges.add(currentEdge);
      const nextNode = digraph.opposite(currentNode, currentEdge);
      cycle.addEdgeWithKey(currentEdge, currentNode, target, attributes);
      currentNode = nextNode;
      currentColor = (currentColor + 1) % 3;
      const nextEdge = getNextEdge(currentNode, currentColor);
      if (!nextEdge) break;
      currentEdge = nextEdge;
    }

    cycles.push(cycle);
  });

  return cycles;
};

const ColorCyclePlotter: React.FC<ColorCyclePlotterProps> = ({ nodes, edges }) => {
  const graph_obj = new UndirectedGraph();
  nodes.forEach(node => {
    graph_obj.addNode(node.id);
  })
  edges.forEach(edge => {
    graph_obj.addEdgeWithKey(`${edge.from}-${edge.to}`, edge.from, edge.to);
  })
  greedyEdgeColoring(graph_obj, 3);
  const coloredEdges = edges.map(edge => {
    const edge_color_num = graph_obj.getUndirectedEdgeAttribute(edge.from, edge.to, 'color') as number
    const edge_color = {
        0: 'red', 1: 'green', 2: 'blue'
    }[edge_color_num]
    return {
    ...edge,
    color: edge_color
  }})
  const cycles = decomposeIntoCycles(graph_obj);
  return (
    <div>
        <p>Graph Coloring</p>
        <GraphPlotter
            nodes={nodes}
            edges={coloredEdges}
        />
        <div>
          <h3>Cycles</h3>
          {cycles.map((cycle, index) => (
            <div key={index}>
              <p>Cycle {index + 1}:</p>
              <ul>
                {cycle.mapEdges((edge, source, destination) => (
                  <li key={edge}>{edge}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
    </div>
  );
};

export default ColorCyclePlotter;
