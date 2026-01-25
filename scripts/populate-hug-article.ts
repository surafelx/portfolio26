import { createArticle } from '../src/lib/database';
import type { ArticleBlock } from '../src/lib/database';

function createBlock(id: string, type: ArticleBlock['type'], content: string, metadata?: ArticleBlock['metadata']): ArticleBlock {
  return { id, type, content, metadata };
}

async function populateHugArticle() {
  try {
    const article = {
      title: "The Hug of 2026",
      excerpt: "A reflection on connection, performance, and community in the creative journey of 2026.",
      imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&h=400&fit=crop&crop=center",
      blocks: [
        createBlock("opening-prayer", "paragraph", "Before anything else, a friend sent me a prayer.\n\nNot the light kind. Not the rushed kind. A real one. Thought-through. Heavy in a good way. The kind that makes you pause before replying. After I read it, I texted him back almost instinctively: 'We'll hug after.' I didn't overthink it. Some things just land where they're supposed to."),
        createBlock("opportunity", "paragraph", "He also gave me the opportunity to present at his event. That mattered more than people realize. Being trusted with space—especially when you're still becoming—is rare. It didn't feel like charity. It felt like belief."),
        createBlock("the-hug-header", "h2", "The Hug"),
        createBlock("event-chaos", "paragraph", "When the day came, everything was hectic. People running around, setting things up, tearing things down, conversations overlapping. That beautiful kind of chaos where you know something real is happening. In the middle of all that, Dagmawi pulled me in for a picture—no warning, no setup. And right there, inside the noise and movement, the hug happened.\n\nNot planned. Not staged. Just real."),
        createBlock("confirmation", "paragraph", "That hug closed the loop that started with the prayer. In that moment, I didn't feel ብቻ. I didn't feel like I was carrying this alone. It felt like a quiet confirmation—you're on the right path, አይደል?"),
        createBlock("performance-header", "h2", "The Performance"),
        createBlock("live-performance", "paragraph", "Earlier, during my second live performance, I made sure people understood what they were witnessing. I talked about uzulangs—live-coding music languages where rhythm, math, and instinct meet. I touched on TouchDesigner too (lol), because for me sound alone isn't enough anymore. Code, visuals, systems—this is how the music breathes now."),
        createBlock("transparency", "paragraph", "I also shared where everything lives: GitHub. All my songs, experiments, half-finished ideas. Open. Documented. No mystery persona. Just process."),
        createBlock("celebrity-moment", "paragraph", "And yeah—I won't lie—it was wild being treated like a bit of a celebrity. People stopping me. Cameras out. Later seeing posts and clips pop up on other channels. Different angles of the same moment. Really cool. Really grounding."),
        createBlock("people-header", "h2", "The People"),
        createBlock("people-intro", "paragraph", "What made the night even better was the people."),
        createBlock("robi", "paragraph", "I saw Robi—a long-time friend and genuinely amazing human. He spoke about BeSpoke UI, and honestly, anything that man does is well thought out. He's been like that since university. Intentional. Precise. Watching him present felt like watching consistency compound over time."),
        createBlock("other-presentations", "paragraph", "Then there were all the other presentations.\n\nYohannes from Muqecha Studios had us laughing, talking about games and that shared frustration gamers know too well. Humor mixed with truth in the best way.\n\nBiniyam Daniel from Addis AI spoke about AI and data with real care. You could feel how meticulously they craft the data behind their systems. Not hype. Craft. That stood out."),
        createBlock("ecosystem", "paragraph", "So many sharp, curious, thoughtful people in one room. Different disciplines. Same hunger."),
        createBlock("discord-invitation", "paragraph", "I also shared an open invitation: there's a Discord server dedicated to live-coding music—a space for people who want to experiment, learn, break things, share patterns, sounds, failures, and wins. I genuinely want people from this event to be part of that community. Not as spectators, but as builders. (Link to the live-coding music Discord community)"),
        createBlock("showcase", "paragraph", "Here are some cool people, channels, and showcases from today's event—this is the kind of ecosystem that makes you want to keep showing up."),
        createBlock("closing-reflection", "paragraph", "After the event ended, after the running slowed down, after the noise settled—that hug stayed with me.\n\nThe hug of 2026 wasn't loud.\nIt wasn't dramatic.\nBut it meant everything."),
        createBlock("final-thoughts", "paragraph", "This was only my second live performance.\nBut it didn't feel like the beginning anymore."),
        createBlock("sample-music", "strudel-music", "n('c3 e3 g3').s('piano').slow(2)", { title: "A Simple Melody" })
      ],
      tags: ["personal-reflection", "community", "performance", "live-coding", "connection", "2026"],
      publishedAt: "2026-01-24",
      readingTime: "5 min read",
      author: "Surafel Yimam"
    };

    console.log('🚀 Creating "The Hug of 2026" article...');

    const createdArticle = await createArticle(article);
    console.log(`✅ Created article: "${article.title}"`);
    console.log(`   📄 Blocks: ${article.blocks.length}`);
    console.log(`   🏷️  Tags: ${article.tags.join(', ')}`);
    console.log(`   📅 Published: ${article.publishedAt}`);
    console.log(`   👤 Author: ${article.author}`);
    console.log('');
    console.log('🎉 Article creation completed!');

  } catch (error) {
    console.error('❌ Error creating article:', error);
  }
}

populateHugArticle();