
import { useState, useEffect } from "react";

type MindMapNode = {
  id: string;
  label: string;
  position: { x: number; y: number };
  color?: string;
};

type MindMapConnection = {
  id: string;
  source: string;
  target: string;
};

export const MindMap = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Define the mind map data structure with colors
  const nodes: MindMapNode[] = [
    { id: "root", label: "SkillSwap", position: { x: 50, y: 50 }, color: "#10B981" }, // Primary green
    { id: "ai", label: "AI Learning", position: { x: 20, y: 15 }, color: "#3ECF8E" }, // Accent green
    { id: "peer", label: "Peer Matching", position: { x: 80, y: 15 }, color: "#3ECF8E" },
    { id: "skills", label: "Skill Tracking", position: { x: 20, y: 85 }, color: "#3ECF8E" },
    { id: "resources", label: "Resources", position: { x: 80, y: 85 }, color: "#3ECF8E" },
    { id: "mentors", label: "Mentorship", position: { x: 20, y: 50 }, color: "#3ECF8E" },
    { id: "collab", label: "Collaboration", position: { x: 80, y: 50 }, color: "#3ECF8E" },
  ];

  const connections: MindMapConnection[] = [
    { id: "c1", source: "root", target: "ai" },
    { id: "c2", source: "root", target: "peer" },
    { id: "c3", source: "root", target: "skills" },
    { id: "c4", source: "root", target: "resources" },
    { id: "c5", source: "root", target: "mentors" },
    { id: "c6", source: "root", target: "collab" },
    { id: "c7", source: "ai", target: "skills" },
    { id: "c8", source: "peer", target: "collab" },
  ];

  // Animation effect for nodes to appear gradually
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="aspect-square  rounded-xl p-1">
      <div className="w-full h-full rounded-lg overflow-hidden relative">
        {/* Mind map canvas */}
        <div className="w-full h-full relative p-4">
          {/* Center node */}
          <div 
            className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
              bg-primary text-white rounded-full p-4 z-10 font-bold shadow-lg
              transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
            style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            SkillSwap
          </div>

          {/* Connection lines - draw before nodes for proper z-index */}
          {connections.map((connection) => {
            const source = nodes.find(n => n.id === connection.source);
            const target = nodes.find(n => n.id === connection.target);
            
            if (!source || !target) return null;
            
            // Calculate relative positions for the SVG
            const centerX = 50;
            const centerY = 50;
            
            // Scale the positions to fit in the container
            const sx = centerX + (source.position.x - centerX) * 0.8;
            const sy = centerY + (source.position.y - centerY) * 0.8;
            const tx = centerX + (target.position.x - centerX) * 0.8;
            const ty = centerY + (target.position.y - centerY) * 0.8;
            
            return (
              <svg 
                key={connection.id} 
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-70' : 'opacity-0'}`}
                style={{ zIndex: 1 }}
              >
                <line 
                  x1={`${sx}%`} 
                  y1={`${sy}%`} 
                  x2={`${tx}%`} 
                  y2={`${ty}%`} 
                  stroke="#3ECF8E" 
                  strokeWidth="2"
                  strokeOpacity="0.7"
                  strokeDasharray={connection.source === "root" ? "none" : "5,3"}
                />
              </svg>
            );
          })}

          {/* Nodes other than root */}
          {nodes.filter(node => node.id !== "root").map((node, index) => {
            // Scale the positions to fit in the container
            const centerX = 50;
            const centerY = 50;
            const x = centerX + (node.position.x - centerX) * 0.8;
            const y = centerY + (node.position.y - centerY) * 0.8;
            
            return (
              <div 
                key={node.id}
                className={`absolute text-white rounded-lg p-3 border border-gray-700/50
                  transition-all duration-700 shadow-lg backdrop-blur-sm ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`, 
                  transform: 'translate(-50%, -50%)',
                  zIndex: 5,
                  transitionDelay: `${index * 150}ms`,
                  backgroundColor: node.color ? `${node.color}20` : 'rgba(30, 30, 30, 0.7)',
                  minWidth: '110px',
                  textAlign: 'center',
                  boxShadow: `0 0 15px rgba(62, 207, 142, 0.2)`,
                  backdropFilter: 'blur(8px)'
                }}
              >
                {node.label}
              </div>
            );
          })}

          {/* Animated pulse rings for the center node */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-[120px] h-[120px] rounded-full bg-primary/10 animate-pulse"></div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-[150px] h-[150px] rounded-full bg-primary/5 animate-pulse" 
            style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </div>
  );
};
