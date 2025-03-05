import React from 'react';
import { UndirectedGraph } from 'graphology';

// Define the props for the component
export interface GraphPlotterProps {
  graph: UndirectedGraph;
  onGraphUpdate?: (graph: UndirectedGraph) => void;
}

// The stateful component that manages node positions internally.
// It resets its internal state when the incoming nodes or edges change.
const GraphPlotter: React.FC<GraphPlotterProps> = ({ graph, onGraphUpdate }) => {
  const nodes = graph.nodes().map(node => ({
    id: node,
    x: graph.getNodeAttribute(node, 'x'),
    y: graph.getNodeAttribute(node, 'y'),
    color: graph.getNodeAttribute(node, 'color'),
  }));

  const edges = graph.edges().map(edge => ({
    id: edge,
    from: graph.source(edge),
    to: graph.target(edge),
    color: graph.getEdgeAttribute(edge, 'color'),
  }));

  console.log('plotting graph');
  edges.forEach(edge => {
    console.log(edge);
  }
  );

  // A sample event handler to update a node's position when it is clicked.
  const handleNodeClick = (node: { id: string; x: number; y: number; color?: string }) => {
    // For demonstration, move the clicked node by +10 on both axes.
    graph.setNodeAttribute(node.id, 'x', node.x + 10);
    graph.setNodeAttribute(node.id, 'y', node.y + 10);
    if (onGraphUpdate) {
      onGraphUpdate(graph);
    }
  };

  return (
    <svg width={500} height={500} style={{ border: '1px solid #ccc' }}>
      {/* Render edges as lines connecting nodes */}
      {graph.mapEdges((edge, attributes, source, target) => {
        const fromNode = graph.getNodeAttributes(source);
        const toNode = graph.getNodeAttributes(target);
        console.log(fromNode);
        console.log(toNode);
        if (!fromNode || !toNode) return null;
        return (
          <line
            key={`edge-${edge}`}
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            stroke={attributes.color || "black"}
          />
        );
      })}
      {/* Render nodes as circles */}
      {nodes.map(node => (
        <circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={10}
          fill={node.color || "blue"}
          style={{ cursor: 'pointer' }}
          onClick={() => handleNodeClick(node)}
        />
      ))}
    </svg>
  );
};

export default GraphPlotter;
