"use client";
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Move, Settings } from 'lucide-react';
import type { ProjectNode, ProjectEdge } from '@/lib/database';

interface ProjectNodeGraphProps {
  nodes: ProjectNode[];
  edges: ProjectEdge[];
  onChange?: (nodes: ProjectNode[], edges: ProjectEdge[]) => void;
  readOnly?: boolean;
  height?: number;
}

export function ProjectNodeGraph({ nodes, edges, onChange, readOnly = false, height = 500 }: ProjectNodeGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (readOnly) return;

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggedNode(nodeId);
    setDragOffset({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    });
  }, [nodes, readOnly]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedNode || readOnly || !onChange) return;

    const newNodes = nodes.map(node =>
      node.id === draggedNode
        ? { ...node, position: { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } }
        : node
    );
    onChange(newNodes, edges);
  }, [draggedNode, dragOffset, nodes, edges, onChange, readOnly]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  const addNode = useCallback(() => {
    if (readOnly || !onChange) return;

    const newNode: ProjectNode = {
      id: `node-${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      data: { label: 'New Component' }
    };
    onChange([...nodes, newNode], edges);
  }, [nodes, edges, onChange, readOnly]);

  const deleteNode = useCallback((nodeId: string) => {
    if (readOnly || !onChange) return;

    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    onChange(newNodes, newEdges);
    setSelectedNode(null);
  }, [nodes, edges, onChange, readOnly]);

  const updateNode = useCallback((nodeId: string, updates: Partial<ProjectNode>) => {
    if (readOnly || !onChange) return;

    const newNodes = nodes.map(node =>
      node.id === nodeId ? { ...node, ...updates } : node
    );
    onChange(newNodes, edges);
  }, [nodes, edges, onChange, readOnly]);

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button onClick={addNode} size="sm" variant="default">
              <Plus size={16} className="mr-2" />
              Add Component
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {nodes.length} components • Drag to move • Click to edit
          </div>
        </div>
      )}

      <div className="relative border border-border rounded-lg bg-card/50 overflow-hidden" style={{ height: `${height}px` }}>
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        <svg
          className="w-full h-full relative z-10"
          style={{ cursor: readOnly ? 'default' : 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Edges */}
          {edges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const sourceX = sourceNode.position.x + 120; // Node width / 2 + padding
            const sourceY = sourceNode.position.y + 40;  // Node height / 2 + padding
            const targetX = targetNode.position.x + 120;
            const targetY = targetNode.position.y + 40;

            return (
              <line
                key={edge.id}
                x1={sourceX}
                y1={sourceY}
                x2={targetX}
                y2={targetY}
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
                className="drop-shadow-sm"
              />
            );
          })}

          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="12"
              markerHeight="8"
              refX="11"
              refY="4"
              orient="auto"
            >
              <polygon
                points="0 0, 12 4, 0 8"
                fill="hsl(var(--primary))"
              />
            </marker>
          </defs>

          {/* Nodes */}
          {nodes.map(node => {
            const isSelected = selectedNode === node.id;
            const nodeColor = node.type === 'input' ? 'hsl(var(--terminal-cyan))' :
                             node.type === 'output' ? 'hsl(var(--terminal-amber))' :
                             'hsl(var(--primary))';

            return (
              <g key={node.id}>
                {/* Node shadow */}
                <rect
                  x={node.position.x + 2}
                  y={node.position.y + 2}
                  width="240"
                  height="80"
                  rx="12"
                  fill="rgba(0,0,0,0.1)"
                  className="pointer-events-none"
                />

                {/* Main node */}
                <rect
                  x={node.position.x}
                  y={node.position.y}
                  width="240"
                  height="80"
                  rx="12"
                  fill={isSelected ? nodeColor : "hsl(var(--card))"}
                  stroke={isSelected ? nodeColor : "hsl(var(--border))"}
                  strokeWidth={isSelected ? "3" : "2"}
                  className={`${!readOnly ? 'cursor-move hover:stroke-primary' : ''} transition-all duration-200 drop-shadow-sm`}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onClick={() => !readOnly && setSelectedNode(node.id)}
                />

                {/* Node type indicator */}
                <circle
                  cx={node.position.x + 20}
                  cy={node.position.y + 20}
                  r="6"
                  fill={nodeColor}
                  className="pointer-events-none"
                />

                {/* Node label */}
                <text
                  x={node.position.x + 120}
                  y={node.position.y + 35}
                  textAnchor="middle"
                  className={`text-sm font-semibold pointer-events-none ${
                    isSelected ? 'fill-white' : 'fill-foreground'
                  }`}
                >
                  {node.data.label}
                </text>

                {/* Node technologies */}
                {node.data.tech && node.data.tech.length > 0 && (
                  <text
                    x={node.position.x + 120}
                    y={node.position.y + 55}
                    textAnchor="middle"
                    className={`text-xs pointer-events-none ${
                      isSelected ? 'fill-white/80' : 'fill-muted-foreground'
                    }`}
                  >
                    {node.data.tech.slice(0, 3).join(' • ')}
                    {node.data.tech.length > 3 && '...'}
                  </text>
                )}

                {/* Node type label */}
                <text
                  x={node.position.x + 220}
                  y={node.position.y + 20}
                  textAnchor="end"
                  className={`text-xs font-medium pointer-events-none ${
                    isSelected ? 'fill-white/70' : 'fill-muted-foreground'
                  }`}
                >
                  {node.type}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Instructions overlay for empty state */}
        {nodes.length === 0 && !readOnly && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
                <Plus size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">No Components Yet</h3>
              <p className="text-sm max-w-xs">
                Click "Add Component" to start building your project architecture.
                Drag components to position them and click to edit details.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Node Editor */}
      {selectedNodeData && !readOnly && (
        <div className="border border-border rounded-lg p-6 bg-card/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-primary">Edit Component</h3>
              <p className="text-sm text-muted-foreground">Configure the selected component properties</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteNode(selectedNode!)}
              className="hover:bg-destructive/90"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="node-label" className="text-sm font-medium">
                Component Name *
              </Label>
              <Input
                id="node-label"
                value={selectedNodeData.data.label}
                onChange={(e) => updateNode(selectedNode!, {
                  data: { ...selectedNodeData.data, label: e.target.value }
                })}
                placeholder="e.g., User Authentication, API Gateway"
                className="text-sm"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="node-type" className="text-sm font-medium">
                Component Type
              </Label>
              <select
                id="node-type"
                value={selectedNodeData.type}
                onChange={(e) => updateNode(selectedNode!, {
                  type: e.target.value as ProjectNode['type']
                })}
                className="w-full bg-secondary border border-border px-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md text-sm"
              >
                <option value="input">🔵 Input (Entry Point)</option>
                <option value="default">⚪ Default (Core Component)</option>
                <option value="output">🟡 Output (Result/Exit)</option>
              </select>
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="node-description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Input
                id="node-description"
                value={selectedNodeData.data.description || ''}
                onChange={(e) => updateNode(selectedNode!, {
                  data: { ...selectedNodeData.data, description: e.target.value }
                })}
                placeholder="Brief description of this component's role"
                className="text-sm"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="node-tech" className="text-sm font-medium">
                Technologies Used
              </Label>
              <Input
                id="node-tech"
                value={selectedNodeData.data.tech?.join(', ') || ''}
                onChange={(e) => updateNode(selectedNode!, {
                  data: {
                    ...selectedNodeData.data,
                    tech: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }
                })}
                placeholder="React, Node.js, MongoDB, Docker"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Separate technologies with commas. These will be displayed on the component.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>💡 Tip: Drag components to reposition them on the canvas</span>
            </div>
          </div>
        </div>
      )}

      {readOnly && nodes.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No project structure defined yet.
        </div>
      )}
    </div>
  );
}