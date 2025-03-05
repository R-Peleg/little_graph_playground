import React from 'react';
import { UndirectedGraph } from 'graphology';

// Define the props for the component
export interface GraphPlotterProps {
  graph: UndirectedGraph;
  onGraphUpdate?: (graph: UndirectedGraph) => void;
  width?: number;
  height?: number;
}

// The stateful component that manages node positions internally.
// It resets its internal state when the incoming nodes or edges change.
const GraphPlotter: React.FC<GraphPlotterProps> = ({ graph, onGraphUpdate, width = 500, height = 500 }) => {
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
    <svg width={width} height={height} style={{ border: '1px solid #ccc' }}>
      {/* Render edges as lines connecting nodes */}
      {graph.mapEdges((edge, attributes, source, target, sourceAttrs, targetAttrs, undirected) => {
        const fromNode = graph.getNodeAttributes(source);
        const toNode = graph.getNodeAttributes(target);
        if (!fromNode || !toNode) return null;

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const angle = Math.atan2(dy, dx);
        const arrowSize = 20;

        return (
          <g key={`edge-${edge}`}>
            <line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={attributes.color || "black"}
            />
            {!undirected && (
              <polygon
                points={`
                  ${toNode.x},${toNode.y} 
                  ${toNode.x - arrowSize * Math.cos(Math.PI / 6 + angle)},${toNode.y - arrowSize * Math.sin(Math.PI / 6 + angle)} 
                  ${toNode.x - arrowSize * Math.cos(-Math.PI / 6 + angle)},${toNode.y - arrowSize * Math.sin(-Math.PI / 6 + angle)}
                `}
                fill={attributes.color || "black"}
              />
            )}
          </g>
        );
      })}
      {/* Render nodes as circles */}
      {graph.mapNodes((node, attributes) => (
        <circle
          key={node}
          cx={attributes.x}
          cy={attributes.y}
          r={10}
          fill={attributes.color || "blue"}
          style={{ cursor: 'pointer' }}
          onClick={() => handleNodeClick({id: node, x: attributes.x, y: attributes.y, color: attributes.color})}
        />
      ))}
    </svg>
  );
};

export default GraphPlotter;
