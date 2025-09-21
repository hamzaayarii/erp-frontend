import React, { useState } from 'react';
import { PortfolioTabs } from '../components/PortfolioTabs';
import { Plus, Minus } from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  type: 'program' | 'product' | 'project' | 'topic';
  children?: TreeNode[];
}


const getIcon = (type: string) => {
  switch (type) {
    case 'program': return <img src="/icons/program.png" alt="Program" className="w-4 h-4" />;
    case 'product': return <img src="/icons/product.png" alt="Product" className="w-4 h-4" />;
    case 'project': return <img src="/icons/project.png" alt="Project" className="w-4 h-4" />;
    case 'topic': return null; 
    default: return <div className="w-3 h-3 bg-gray-400 rounded-sm" />;
  }
};

const getNodePrefix = (type: string, id: string) => {
  const numericId = id.replace(/^[a-z]+-/, '');
  switch (type) {
    case 'program': return `Pr-${numericId}`;
    case 'product': return id.toUpperCase();
    case 'project': return `Pr-${numericId}`;
    case 'topic': return '';
    default: return id;
  }
};

interface NodePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const NodeBox: React.FC<{ 
  node: TreeNode; 
  isExpanded: boolean; 
  onToggle: () => void;
  level: number;
  onPositionUpdate: (id: string, position: NodePosition) => void;
  forceRecalculate: number;
}> = ({ node, isExpanded, onToggle, level, onPositionUpdate, forceRecalculate }) => {
  const hasChildren = node.children && node.children.length > 0;
  const displayId = getNodePrefix(node.type, node.id);
  
  const nodeRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const updatePosition = () => {
      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        const containerRect = nodeRef.current.closest('.tree-container')?.getBoundingClientRect();
        if (containerRect) {
          const newPosition = {
            id: node.id,
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: rect.width,
            height: rect.height
          };
          onPositionUpdate(node.id, newPosition);
        }
      }
    };

    // Add a small delay to allow DOM updates when expanding/collapsing
    const timeoutId = setTimeout(updatePosition, 10);
    return () => clearTimeout(timeoutId);
  }, [node.id, level, onPositionUpdate, forceRecalculate]); // Added forceRecalculate to trigger global updates

  return (
    <div 
      ref={nodeRef}
      className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-2 shadow-sm w-fit mb-8"
      style={{ 
        marginLeft: `${level * 40}px`,
        minWidth: '280px'
      }}
    >
      {hasChildren && (
        <button 
          onClick={onToggle} 
          className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          {isExpanded ? (
            <Minus className="w-3 h-3 text-white" />
          ) : (
            <Plus className="w-3 h-3 text-white" />
          )}
        </button>
      )}
      
      {!hasChildren && <div className="w-4" />}
      
      {getIcon(node.type)}
      
      <div className="flex flex-col">
        {displayId && <span className="text-xs text-gray-600 font-medium">{displayId}</span>}
        <span className="text-sm text-gray-900 font-medium">{node.name}</span>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['pr-01', 'pr-02', 'pr-03', 'dw01', 'pj-01']));
  const [nodePositions, setNodePositions] = useState<Map<string, NodePosition>>(new Map());
  const [forceRecalculate, setForceRecalculate] = useState(0);

  // Load portfolio data from JSON file
  React.useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/PortflioData.json');
        if (!response.ok) {
          throw new Error('Failed to load portfolio data');
        }
        const data = await response.json();
        setPortfolioData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading portfolio data:', err);
        setError('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, []);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
    // Force recalculation of all arrow positions when any node is toggled
    setForceRecalculate(prev => prev + 1);
  };

  const updateNodePosition = React.useCallback((id: string, position: NodePosition) => {
    setNodePositions(prev => new Map(prev.set(id, position)));
  }, []);

  // Function to collect all node IDs that have children
  const getAllExpandableNodeIds = React.useCallback(() => {
    const nodeIds: string[] = [];
    
    const traverse = (node: TreeNode) => {
      if (node.children && node.children.length > 0) {
        nodeIds.push(node.id);
      }
      if (node.children) {
        node.children.forEach(child => traverse(child));
      }
    };

    portfolioData.forEach(node => traverse(node));
    return nodeIds;
  }, [portfolioData]);

  // Expand all nodes
  const expandAll = () => {
    const allExpandableIds = getAllExpandableNodeIds();
    setExpandedNodes(new Set(allExpandableIds));
    setForceRecalculate(prev => prev + 1);
  };

  // Collapse all nodes
  const collapseAll = () => {
    setExpandedNodes(new Set());
    setForceRecalculate(prev => prev + 1);
  };

  // Render programs hierarchically
  const renderProgramsColumn = () => {
    const renderProgramNode = (node: TreeNode, level: number = 0): React.ReactNode => {
      if (node.type !== 'program') return null;
      
      const isExpanded = expandedNodes.has(node.id);
      
      return (
        <div key={node.id}>
          <NodeBox
            node={node}
            isExpanded={isExpanded}
            onToggle={() => toggleNode(node.id)}
            level={level}
            onPositionUpdate={updateNodePosition}
            forceRecalculate={forceRecalculate}
          />
          {/* Render child programs with increased level */}
          {node.children && isExpanded && (
            <div>
              {node.children
                .filter(child => child.type === 'program')
                .map(program => renderProgramNode(program, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {portfolioData.map(node => renderProgramNode(node))}
      </div>
    );
  };

  // Collect products from all expanded programs with hierarchy info
  const collectProducts = () => {
    const products: Array<{ node: TreeNode; level: number; parentId?: string }> = [];
    const processedIds = new Set<string>();
    
    const traverse = (node: TreeNode, level: number = 0) => {
      if (node.children && expandedNodes.has(node.id)) {
        node.children.forEach(child => {
          if (child.type === 'product' && !processedIds.has(child.id)) {
            processedIds.add(child.id);
            products.push({ node: child, level, parentId: node.id });
            // Recursively collect sub-products
            if (child.children && expandedNodes.has(child.id)) {
              child.children.forEach(subChild => {
                if (subChild.type === 'product' && !processedIds.has(subChild.id)) {
                  processedIds.add(subChild.id);
                  products.push({ node: subChild, level: level + 1, parentId: child.id });
                }
              });
            }
          }
          traverse(child, level);
        });
      }
    };

    portfolioData.forEach(node => traverse(node));
    return products;
  };

  // Collect projects from all expanded products
  const collectProjects = () => {
    const projects: TreeNode[] = [];
    
    const traverse = (node: TreeNode) => {
      if (node.children && expandedNodes.has(node.id)) {
        node.children.forEach(child => {
          if (child.type === 'project') {
            projects.push(child);
          }
          traverse(child);
        });
      }
    };

    portfolioData.forEach(traverse);
    return projects;
  };

  const products = collectProducts();
  const projects = collectProjects();

  const renderConnections = () => {
    const connections: React.ReactNode[] = [];
    
    const processNode = (node: TreeNode) => {
      const parentPos = nodePositions.get(node.id);
      if (!parentPos || !node.children || !expandedNodes.has(node.id)) return;

      // Group children by type for better arrow handling
      const sameTypeChildren = node.children.filter(child => 
        (node.type === 'program' && child.type === 'program') ||
        (node.type === 'product' && child.type === 'product') ||
        (node.type === 'project' && child.type === 'topic')
      );
      const differentTypeChildren = node.children.filter(child => 
        !((node.type === 'program' && child.type === 'program') ||
          (node.type === 'product' && child.type === 'product') ||
          (node.type === 'project' && child.type === 'topic'))
      );

      // Handle same-type children with shared trunk
      if (sameTypeChildren.length > 0) {
        // For project-to-topic connections, start from bottom-middle
        const isProjectToTopic = node.type === 'project' && sameTypeChildren.some(child => child.type === 'topic');
        const bottomX = isProjectToTopic ? parentPos.x + parentPos.width / 2 : parentPos.x + 20;
        const bottomY = parentPos.y + parentPos.height;
        const trunkLength = node.type === 'program' ? 20 : node.type === 'product' ? 18 : 15;
        const trunkY = bottomY + trunkLength;

        // Draw main trunk
        connections.push(
          <g key={`${node.id}-trunk`}>
            <path
              d={`M ${bottomX} ${bottomY} L ${bottomX} ${trunkY}`}
              stroke="#6b7280"
              strokeWidth="1"
              fill="none"
            />
          </g>
        );

        // Draw branches to each child
        sameTypeChildren.forEach(child => {
          const childPos = nodePositions.get(child.id);
          if (!childPos) return;

          const leftX = childPos.x;
          const centerY = childPos.y + childPos.height / 2;
          const radius = 5; // Small radius for subtle rounding

          connections.push(
            <g key={`${node.id}-${child.id}`}>
              <path
                d={`M ${bottomX} ${trunkY} L ${leftX - 20} ${trunkY} L ${leftX - 20} ${centerY - radius} Q ${leftX - 20} ${centerY} ${leftX - 20 + radius} ${centerY} L ${leftX} ${centerY}`}
                stroke="#6b7280"
                strokeWidth="1"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            </g>
          );
        });
      }

      // Handle different-type children (cross-column connections)
      differentTypeChildren.forEach(child => {
        const childPos = nodePositions.get(child.id);
        if (!childPos) return;

        // Special handling for project to topic connections
        if (node.type === 'project' && child.type === 'topic') {
          // Start from right side of project box
          const startX = parentPos.x + parentPos.width;
          const startY = parentPos.y + parentPos.height / 2;
          const endX = childPos.x;
          const endY = childPos.y + childPos.height / 2;
          // Add subtle curve for project to topic connections
          const midX = startX + (endX - startX) * 0.7; // Control point closer to start
          connections.push(
            <g key={`${node.id}-${child.id}`}>
              <path
                d={`M ${startX} ${startY} Q ${midX} ${startY} ${endX} ${endY}`}
                stroke="#6b7280"
                strokeWidth="1"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            </g>
          );
        } else {
          // Regular cross-column connections (from right side)
          const startX = parentPos.x + parentPos.width;
          const startY = parentPos.y + parentPos.height / 2;
          const endX = childPos.x;
          const endY = childPos.y + childPos.height / 2;
          const radius = 5; // Small radius for subtle rounding

          const midX = startX + (endX - startX) / 2;
          connections.push(
            <g key={`${node.id}-${child.id}`}>
              <path
                d={`M ${startX} ${startY} L ${midX - radius} ${startY} Q ${midX} ${startY} ${midX} ${startY + (endY > startY ? radius : -radius)} L ${midX} ${endY - (endY > startY ? radius : -radius)} Q ${midX} ${endY} ${midX + radius} ${endY} L ${endX} ${endY}`}
                stroke="#6b7280"
                strokeWidth="1"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            </g>
          );
        }
      });

      node.children.forEach(child => processNode(child));
    };

    portfolioData.forEach(processNode);
    return connections;
  };

  if (loading) {
    return (
      <div className="min-h-screen pr-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pr-5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pr-5">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        </div>
      </div>
      
      <div className="flex flex-col gap-8">
        <PortfolioTabs />
        
        <div className="flex justify-end gap-2 ">
          <button
            onClick={collapseAll}
            className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
            title="Collapse All"
          >
            <Minus className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={expandAll}
            className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
            title="Expand All"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-x-auto">
          <div className="tree-container relative min-w-[1400px]">
            

            {/* Three Column Layout */}
            <div className="flex gap-20 items-start">
              {/* Programs Column */}
              <div className="space-y-4 min-w-[380px]">
                {renderProgramsColumn()}
              </div>

              {/* Products Column */}
              <div className="space-y-4 min-w-[380px]">
                {products.map((productInfo, index) => (
                  <NodeBox
                    key={`${productInfo.node.id}-${productInfo.level}-${index}`}
                    node={productInfo.node}
                    isExpanded={expandedNodes.has(productInfo.node.id)}
                    onToggle={() => toggleNode(productInfo.node.id)}
                    level={productInfo.level}
                    onPositionUpdate={updateNodePosition}
                    forceRecalculate={forceRecalculate}
                  />
                ))}
              </div>

              {/* Projects Column with Topics */}
              <div className="space-y-4 min-w-[380px]">
                {projects.map(project => (
                  <div key={project.id}>
                    <NodeBox
                      node={project}
                      isExpanded={expandedNodes.has(project.id)}
                      onToggle={() => toggleNode(project.id)}
                      level={0}
                      onPositionUpdate={updateNodePosition}
                      forceRecalculate={forceRecalculate}
                    />
                    {/* Show topics under projects with much more spacing */}
                    {project.children && expandedNodes.has(project.id) && (
                      <div className="ml-80 mt-4 space-y-2">
                        {project.children.filter(child => child.type === 'topic').map(topic => (
                          <NodeBox
                            key={topic.id}
                            node={topic}
                            isExpanded={false}
                            onToggle={() => {}}
                            level={0}
                            onPositionUpdate={updateNodePosition}
                            forceRecalculate={forceRecalculate}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Connection Lines Overlay */}
            <svg 
              className="absolute inset-0 pointer-events-none" 
              style={{ zIndex: 1 }}
              width="100%" 
              height="100%"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6b7280"
                  />
                </marker>
              </defs>
              {renderConnections()}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;