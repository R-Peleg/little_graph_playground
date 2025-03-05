import React, { useState } from 'react';
import GraphPlotter from '../componenets/GraphPlotter';
import ColorCyclePlotter from '@/componenets/ColorCyclesPlotter';
import { K4 } from '../graphs/k4';
import { UndirectedGraph } from 'graphology';

export default function Home() {
  const [graph] = useState<UndirectedGraph>(() => K4());

  const handleGraphUpdate = (updatedGraph: UndirectedGraph) => {
    console.log("Graph updated!", updatedGraph);
  };
  
  return <div>
    <h1>Graph Playground</h1>
    <h2>The Graph</h2>
    <GraphPlotter graph={graph} onGraphUpdate={handleGraphUpdate} />
    <h2>Cycle Decomposition</h2>
    <ColorCyclePlotter graph={graph} />
  </div>
}
