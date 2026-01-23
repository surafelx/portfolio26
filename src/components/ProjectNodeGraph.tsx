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
}

export function ProjectNodeGraph({ nodes, edges, onChange, readOnly = false }: ProjectNodeGraphProps) {
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
        <div className="flex gap-2">
          <Button onClick={addNode} size="sm">
            <Plus size={16} className="mr-2" />
            Add Node
          </Button>
        </div>
      )}

      <div className="relative border border-border rounded-lg bg-card/50" style={{ height: '400px' }}>
        <svg
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Edges */}
          {edges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const sourceX = sourceNode.position.x + 100; // Node width / 2
            const sourceY = sourceNode.position.y + 30;  // Node height / 2
            const targetX = targetNode.position.x + 100;
            const targetY = targetNode.position.y + 30;

            return (
              <line
                key={edge.id}
                x1={sourceX}
                y1={sourceY}
                x2={targetX}
                y2={targetY}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          {/* Arrow marker */}
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
                fill="hsl(var(--primary))"
              />
            </marker>
          </defs>

          {/* Nodes */}
          {nodes.map(node => (
            <g key={node.id}>
              <rect
                x={node.position.x}
                y={node.position.y}
                width="200"
                height="60"
                rx="8"
                fill={selectedNode === node.id ? "hsl(var(--primary))" : "hsl(var(--card))"}
                stroke={selectedNode === node.id ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth="2"
                className={`${!readOnly ? 'cursor-move' : ''} hover:stroke-primary transition-colors`}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onClick={() => !readOnly && setSelectedNode(node.id)}
              />
              <text
                x={node.position.x + 100}
                y={node.position.y + 35}
                textAnchor="middle"
                className="text-sm font-medium fill-foreground pointer-events-none"
              >
                {node.data.label}
              </text>
              {node.data.tech && node.data.tech.length > 0 && (
                <text
                  x={node.position.x + 100}
                  y={node.position.y + 50}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground pointer-events-none"
                >
                  {node.data.tech.slice(0, 2).join(', ')}
                  {node.data.tech.length > 2 && '...'}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Node Editor */}
      {selectedNodeData && !readOnly && (
        <div className="border border-border rounded-lg p-4 bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Edit Node</h3>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteNode(selectedNode!)}
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="node-label">Label</Label>
              <Input
                id="node-label"
                value={selectedNodeData.data.label}
                onChange={(e) => updateNode(selectedNode!, {
                  data: { ...selectedNodeData.data, label: e.target.value }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-type">Type</Label>
              <select
                id="node-type"
                value={selectedNodeData.type}
                onChange={(e) => updateNode(selectedNode!, {
                  type: e.target.value as ProjectNode['type']
                })}
                className="w-full bg-secondary border border-border px-3 py-2 text-foreground focus:outline-none focus:border-primary"
              >
                <option value="input">Input</option>
                <option value="default">Default</option>
                <option value="output">Output</option>
              </select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="node-description">Description</Label>
              <Input
                id="node-description"
                value={selectedNodeData.data.description || ''}
                onChange={(e) => updateNode(selectedNode!, {
                  data: { ...selectedNodeData.data, description: e.target.value }
                })}
                placeholder="Optional description"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="node-tech">Technologies (comma-separated)</Label>
              <Input
                id="node-tech"
                value={selectedNodeData.data.tech?.join(', ') || ''}
                onChange={(e) => updateNode(selectedNode!, {
                  data: {
                    ...selectedNodeData.data,
                    tech: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }
                })}
                placeholder="React, Node.js, MongoDB"
              />
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