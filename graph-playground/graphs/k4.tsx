import { GraphDef } from "@/componenets/GraphPlotter"


export const K4: GraphDef = {
    nodes: [
        { id: "1", x: 150, y: 100 },
        { id: "2", x: 250, y: 100 },
        { id: "3", x: 150, y: 200 },
        { id: "4", x: 250, y: 200 },
      ],
    
      // Fully connect all 4 nodes (K4 has all possible edges)
      edges: [
        { from: "1", to: "2" }, { from: "1", to: "3" }, { from: "1", to: "4" },
        { from: "2", to: "3" }, { from: "2", to: "4" },
        { from: "3", to: "4" }
      ]
}
