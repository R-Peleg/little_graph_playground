import React from 'react';
import GraphPlotter, { GraphEdge, GraphNode } from './GraphPlotter';
import { UndirectedGraph } from 'graphology'
import { greedyEdgeColoring } from '@/algo/edge_coloring';

// Define the props for the component
export interface ColorCyclePlotterProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const ColorCyclePlotter: React.FC<ColorCyclePlotterProps> = ({ nodes, edges }) => {
  const graph_obj = new UndirectedGraph();
  nodes.forEach(node => {
    graph_obj.addNode(node.id);
  })
  edges.forEach(edge => {
    graph_obj.addEdge(edge.from, edge.to);
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
  return (
    <div>
        <p>Graph Coloring</p>
        <GraphPlotter
            nodes={nodes}
            edges={coloredEdges}
        />
    </div>
  );
};

export default ColorCyclePlotter;
