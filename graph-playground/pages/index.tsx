import React, { useState } from 'react';
import GraphPlotter, {GraphEdge, GraphNode} from '../componenets/GraphPlotter';
import ColorCyclePlotter from '@/componenets/ColorCyclesPlotter';
import { K4 } from '../graphs/k4';

export default function Home() {
  const [nodes, setNodes] = useState<GraphNode[]>(K4.nodes);

  // Define initial edges (undirected graph)
  const [edges] = useState<GraphEdge[]>(K4.edges);

  // Callback function to handle updates from the GraphPlotter
  const handleGraphUpdate = (updatedNodes: GraphNode[], updatedEdges: GraphEdge[]) => {
    console.log("Graph updated!", updatedNodes, updatedEdges);
    setNodes(updatedNodes); // Update local state with new node positions
  };
  
  return <div>
    <h1>Graph Playground</h1>
    <h2>The Graph</h2>
    <GraphPlotter nodes={nodes} edges={edges} onGraphUpdate={handleGraphUpdate} />
    <h2>Cycle Decomposition</h2>
    <ColorCyclePlotter nodes={nodes} edges={edges} />
  </div>
}
