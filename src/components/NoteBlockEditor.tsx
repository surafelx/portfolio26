"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, ArrowUp, ArrowDown, Type, Image, Code, Quote } from "lucide-react";
import type { NoteBlock } from "@/lib/database";

interface NoteBlockEditorProps {
  blocks: NoteBlock[];
  onChange: (blocks: NoteBlock[]) => void;
}

export const NoteBlockEditor = ({ blocks, onChange }: NoteBlockEditorProps) => {
  const addBlock = (type: NoteBlock['type']) => {
    const newBlock: NoteBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: '',
      metadata: {}
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<NoteBlock>) => {
    const newBlocks = blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    onChange(newBlocks);
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const renderBlockEditor = (block: NoteBlock) => {
    switch (block.type) {
      case 'title':
        return (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter title..."
            className="text-lg font-semibold"
          />
        );
      case 'paragraph':
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter paragraph text..."
            className="min-h-[100px]"
          />
        );
      case 'image':
        return (
          <div className="space-y-3">
            <Input
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Image URL..."
            />
            <Input
              value={block.metadata?.alt || ''}
              onChange={(e) => updateBlock(block.id, {
                metadata: { ...block.metadata, alt: e.target.value }
              })}
              placeholder="Alt text..."
            />
            <Input
              value={block.metadata?.caption || ''}
              onChange={(e) => updateBlock(block.id, {
                metadata: { ...block.metadata, caption: e.target.value }
              })}
              placeholder="Caption..."
            />
          </div>
        );
      case 'code':
        return (
          <div className="space-y-3">
            <Select
              value={block.metadata?.language || ''}
              onValueChange={(value) => updateBlock(block.id, {
                metadata: { ...block.metadata, language: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="bash">Bash</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Enter code..."
              className="min-h-[150px] font-mono"
            />
          </div>
        );
      case 'quote':
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter quote..."
            className="min-h-[80px] italic"
          />
        );
      default:
        return null;
    }
  };

  const getBlockIcon = (type: NoteBlock['type']) => {
    switch (type) {
      case 'title': return <Type size={16} />;
      case 'paragraph': return <Type size={16} />;
      case 'image': return <Image size={16} />;
      case 'code': return <Code size={16} />;
      case 'quote': return <Quote size={16} />;
      default: return <Type size={16} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Block Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('title')}
        >
          <Type size={14} className="mr-2" /> Title
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('paragraph')}
        >
          <Type size={14} className="mr-2" /> Paragraph
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('image')}
        >
          <Image size={14} className="mr-2" /> Image
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('code')}
        >
          <Code size={14} className="mr-2" /> Code
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('quote')}
        >
          <Quote size={14} className="mr-2" /> Quote
        </Button>
      </div>

      {/* Blocks */}
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div key={block.id} className="terminal-border bg-card/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getBlockIcon(block.type)}
                <span className="text-sm text-primary capitalize">{block.type}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                  className="h-8 w-8 p-0"
                >
                  <ArrowUp size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === blocks.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ArrowDown size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteBlock(block.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash size={14} />
                </Button>
              </div>
            </div>
            {renderBlockEditor(block)}
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="terminal-border bg-card/50 p-8 text-center text-muted-foreground">
          <p>No blocks yet. Add your first block above!</p>
        </div>
      )}
    </div>
  );
};