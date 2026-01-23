import { getArticles, updateArticle } from '../src/lib/database';

async function migrateArticles() {
  try {
    console.log('Starting article migration...');
    const articles = await getArticles();

    for (const article of articles) {
      // Check if article already has blocks structure
      if (article.blocks && Array.isArray(article.blocks) && article.blocks.length > 0) {
        console.log(`Article ${article.id} already migrated`);
        continue;
      }

      // Convert old content structure to new blocks structure
      const blocks = [];
      const oldArticle = article as any; // Cast to any to access old properties

      if (oldArticle.content) {
        // Split content by double newlines to create paragraphs
        const paragraphs = oldArticle.content.split('\n\n').filter(p => p.trim());

        for (const paragraph of paragraphs) {
          // Check if it's a heading
          if (paragraph.startsWith('# ')) {
            blocks.push({
              id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'h1',
              content: paragraph.replace('# ', ''),
              metadata: {}
            });
          } else if (paragraph.startsWith('## ')) {
            blocks.push({
              id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'h2',
              content: paragraph.replace('## ', ''),
              metadata: {}
            });
          } else if (paragraph.startsWith('### ')) {
            blocks.push({
              id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'h3',
              content: paragraph.replace('### ', ''),
              metadata: {}
            });
          } else if (paragraph.includes('```')) {
            // Code block
            const codeMatch = paragraph.match(/```([\s\S]*?)```/);
            if (codeMatch) {
              blocks.push({
                id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'code',
                content: codeMatch[1],
                metadata: { language: 'javascript' }
              });
            }
          } else {
            // Regular paragraph
            blocks.push({
              id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'paragraph',
              content: paragraph.replace(/\n/g, ' ').trim(),
              metadata: {}
            });
          }
        }
      }

      // Handle old images structure
      if (oldArticle.images && Array.isArray(oldArticle.images)) {
        for (const image of oldArticle.images) {
          blocks.push({
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'image',
            content: image.url,
            metadata: {
              alt: image.alt || '',
              caption: image.caption || ''
            }
          });
        }
      }

      // If no blocks were created, create a default paragraph
      if (blocks.length === 0) {
        blocks.push({
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'paragraph',
          content: 'This article has been migrated. Please edit it to add content.',
          metadata: {}
        });
      }

      // Update the article with new blocks structure
      const updateData = {
        blocks: blocks,
        // Remove old fields
        content: undefined,
        images: undefined
      };

      await updateArticle(article.id, updateData);
      console.log(`Migrated article: ${article.title} (${blocks.length} blocks)`);
    }

    console.log('✅ Article migration completed!');
  } catch (error) {
    console.error('❌ Error migrating articles:', error);
  }
}

migrateArticles();