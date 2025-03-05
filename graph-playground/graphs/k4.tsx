import { UndirectedGraph } from "graphology";

export function K4(): UndirectedGraph {
  const k4 = new UndirectedGraph();
  k4.addNode("1", { x: 150, y: 100 });
  k4.addNode("2", { x: 250, y: 100 });
  k4.addNode("3", { x: 150, y: 200 });
  k4.addNode("4", { x: 250, y: 200 });
  
  k4.addEdgeWithKey("1-2", "1", "2");
  k4.addEdgeWithKey("1-3", "1", "3");
  k4.addEdgeWithKey("1-4", "1", "4");
  k4.addEdgeWithKey("2-3", "2", "3");
  k4.addEdgeWithKey("2-4", "2", "4");
  k4.addEdgeWithKey("3-4", "3", "4");
  return k4;
}
