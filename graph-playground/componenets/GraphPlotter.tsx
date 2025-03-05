import React, { useState, useEffect } from 'react';

// Define interfaces for nodes and edges
export interface GraphNode {
  id: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string; // node id
  to: string;   // node id
  color?: string; // Optional coloring for the edge
}

export interface GraphDef {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Define the props for the component
export interface GraphPlotterProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  // Callback to update the parent; it passes updated nodes and edges.
  onGraphUpdate?: (nodes: GraphNode[], edges: GraphEdge[]) => void;
}

// The stateful component that manages node positions internally.
// It resets its internal state when the incoming nodes or edges change.
const GraphPlotter: React.FC<GraphPlotterProps> = ({ nodes: initialNodes, edges, onGraphUpdate }) => {
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);

  // When the parent updates the nodes or edges props, reset the internal node state.
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, edges]);

  // A sample event handler to update a node's position when it is clicked.
  const handleNodeClick = (node: GraphNode) => {
    // For demonstration, move the clicked node by +10 on both axes.
    const updatedNodes = nodes.map(n =>
      n.id === node.id ? { ...n, x: n.x + 10, y: n.y + 10 } : n
    );
    setNodes(updatedNodes);
    if (onGraphUpdate) {
      onGraphUpdate(updatedNodes, edges);
    }
  };

  return (
    <svg width={500} height={500} style={{ border: '1px solid #ccc' }}>
      {/* Render edges as lines connecting nodes */}
      {edges.map((edge, index) => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return null;
        return (
          <line
            key={`edge-${index}`}
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            stroke={edge.color || "black"}
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
          fill="blue"
          style={{ cursor: 'pointer' }}
          onClick={() => handleNodeClick(node)}
        />
      ))}
    </svg>
  );
};

export default GraphPlotter;
