import React, { useState, useEffect } from 'react';
import GraphPlotter, {GraphEdge, GraphNode} from '../componenets/GraphPlotter'

export default function Home() {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: "1", x: 100, y: 100 },
    { id: "2", x: 200, y: 200 },
    { id: "3", x: 300, y: 150 },
  ]);

  // Define initial edges (undirected graph)
  const [edges] = useState<GraphEdge[]>([
    { from: "1", to: "2" },
    { from: "2", to: "3" },
    { from: "3", to: "1" },
  ]);

  // Callback function to handle updates from the GraphPlotter
  const handleGraphUpdate = (updatedNodes: GraphNode[], updatedEdges: GraphEdge[]) => {
    console.log("Graph updated!", updatedNodes, updatedEdges);
    setNodes(updatedNodes); // Update local state with new node positions
  };
  
  return <div>
    Graph Playground
    <GraphPlotter nodes={nodes} edges={edges} onGraphUpdate={handleGraphUpdate} />

  </div>
}
