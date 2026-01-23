import { createArticle } from '../src/lib/database';
import type { ArticleBlock } from '../src/lib/database';

function createBlock(id: string, type: ArticleBlock['type'], content: string): ArticleBlock {
  return { id, type, content };
}

async function populateArticles() {
  try {
    const articles = [
      {
        title: "Building Celerus, the U.S. Job Market, and the Reality of W2 vs C2C",
        excerpt: "A deep dive into the challenges of bridging American tech jobs to local talent, exploring the rigid structures and political realities of the U.S. job market.",
        blocks: [
          createBlock("intro-block", "paragraph", "I opened Celerus with a clear but ambitious goal: create a U.S.-based company that could bridge American tech jobs to talent here locally. On paper, it made sense. The demand existed. The skills existed. The gap was structural."),
          createBlock("w2-c2c-header", "h2", "What I didn't fully appreciate at first was how rigid—and political—the U.S. job market can be."),
          createBlock("w2-c2c-content", "paragraph", "One of the first walls I ran into was W2 vs C2C. W2 roles dominate traditional hiring because companies want control: payroll, compliance, liability. C2C (corp-to-corp) sounds flexible, but in practice it's often treated with suspicion unless you already have deep trust, a strong brand, or an established vendor relationship."),
          createBlock("middle-ground", "paragraph", "As a new company, Celerus often sat in an awkward middle ground. Too small to be 'safe,' too independent to fit neatly into HR systems. Many conversations died not because of skill gaps, but because of paperwork, risk policies, or internal politics."),
          createBlock("timing-header", "h2", "Then there's timing."),
          createBlock("timing-content", "paragraph", "The U.S. job market runs on quarters, and Q4 is brutal. Budgets freeze. Hiring managers disappear. Headcount gets 'revisited next year.' Even when roles are posted, they're often placeholders to prepare for Q1. Applying aggressively in Q4 feels productive—but most of the time, it's noise."),
          createBlock("quarterly-pattern", "paragraph", "Q1 and Q2 are where momentum lives. Q3 slows. Q4 pretends."),
          createBlock("conclusion", "paragraph", "Running Celerus taught me that talent alone doesn't win markets—timing, structure, and trust do. It was a humbling education in how systems behave when incentives aren't aligned.")
        ],
        tags: ["business", "entrepreneurship", "us-job-market", "celerus", "w2-c2c"],
        publishedAt: "2024-01-15",
        readingTime: "4 min read",
        author: "Kilo Code"
      },
      {
        title: "Working in the Shadows: A Red Tape Operation I Can't Fully Claim",
        excerpt: "An uncomfortable but educational experience working under someone else's name in a complex data engineering operation.",
        blocks: [
          createBlock("shadow-intro", "paragraph", "There was a period where I worked as a data engineer under someone else's name."),
          createBlock("uncomfortable-reality", "paragraph", "It wasn't glamorous. It wasn't illegal in the way people imagine—but it was deeply uncomfortable. Layers of red tape, intermediaries, and proxy identities made it impossible to attach my real name to the work. I was inside the system, contributing at a high level, but invisible by design."),
          createBlock("educational-value", "paragraph", "Technically, it was one of the most educational experiences of my career. I worked with real pipelines, real scale, real pressure. I learned how data systems fail in production—not in tutorials. I learned how decisions ripple across teams. I learned restraint."),
          createBlock("invisibility-cost", "paragraph", "But I couldn't talk about it. I couldn't point to it. I couldn't say, 'I built that.'"),
          createBlock("internal-growth", "paragraph", "That disconnect changes you. You start measuring growth internally instead of externally. You stop chasing validation and start chasing competence. Still, there's a quiet cost to doing meaningful work you can't proudly stand behind."),
          createBlock("learning-vs-credit", "paragraph", "That experience taught me the difference between learning and credit—and how often they don't travel together.")
        ],
        tags: ["data-engineering", "career-lessons", "red-tape", "professional-growth"],
        publishedAt: "2024-01-22",
        readingTime: "3 min read",
        author: "Kilo Code"
      },
      {
        title: "My First Visual Experiment Started as a Joke",
        excerpt: "How a casual Instagram video sparked a journey into visual experimentation and creative confidence.",
        blocks: [
          createBlock("joke-origin", "paragraph", "My first visual experiment didn't come from a plan or a brief. It came from a moment of impulse."),
          createBlock("instagram-spark", "paragraph", "My sister's friend showed me an Instagram video—some abstract visuals synced to sound. Nothing complex. Nothing perfect. We both had the same reaction: 'We could do that.'"),
          createBlock("casual-attempt", "paragraph", "So we tried."),
          createBlock("no-pressure", "paragraph", "No roadmap. No expectation. Just curiosity and a willingness to look stupid. That first experiment wasn't technically impressive, but it unlocked something important: visuals don't need permission. They just need intention."),
          createBlock("language-development", "paragraph", "From that moment, visuals became a language I kept returning to. Each experiment built confidence. Each event taught me how visuals interact with space, sound, and audience energy. Over time, what started as a casual attempt turned into something people asked for—then relied on."),
          createBlock("permission-granted", "paragraph", "That Instagram video wasn't inspiration in the romantic sense. It was permission.")
        ],
        tags: ["visual-experiments", "creativity", "learning", "instagram"],
        publishedAt: "2024-01-29",
        readingTime: "2 min read",
        author: "Kilo Code"
      },
      {
        title: "Visualspam: Posting Life Without Cleanup",
        excerpt: "An intentional approach to social media that embraces imperfection and shows the real, messy process of creative work.",
        blocks: [
          createBlock("visualspam-intro", "paragraph", "On Instagram, I'm visualspam—and that's intentional."),
          createBlock("no-curation", "paragraph", "I don't curate perfection. I don't hide the gaps. I post the clean moments and the broken ones. The good renders and the failed experiments. The days that make sense and the ones that don't."),
          createBlock("platform-rewards", "paragraph", "Most platforms reward polish, but polish often lies. Real creative work is messy, repetitive, and emotionally uneven. I wanted a space that reflected that truth without apology."),
          createBlock("practice-of-honesty", "paragraph", "Visualspam isn't a brand strategy. It's a practice of honesty. It's a daily log of what I'm actually going through—not what performs best. Some posts land. Some don't. That’s fine."),
          createBlock("lived-experience", "paragraph", "What matters is that when someone scrolls, they're seeing something lived, not manufactured. The beautiful and the ugly exist side by side—because that's how the work actually happens.")
        ],
        tags: ["social-media", "creativity", "authenticity", "instagram", "visualspam"],
        publishedAt: "2024-02-05",
        readingTime: "2 min read",
        author: "Kilo Code"
      },
      {
        title: "Working With Iridi: Learning Through Constraint",
        excerpt: "A collaboration with French artist Iridi that taught valuable lessons about restraint, subtlety, and translating emotional languages.",
        blocks: [
          createBlock("iridi-intro", "paragraph", "I once created a video for a French artist named Iridi, and it taught me more than I expected."),
          createBlock("collaboration-challenge", "paragraph", "Working with another artist—especially across cultures—forces you to listen differently. The goal isn't to show off your style. It's to translate someone else's emotional language into visuals without distorting it."),
          createBlock("restraint-required", "paragraph", "Iridi's music had restraint, texture, and patience. That meant my usual instincts—more movement, more layers—had to be controlled. I learned how to do less on purpose. How to let silence and space carry meaning."),
          createBlock("sharpened-sensitivity", "paragraph", "That project sharpened my sensitivity. It reminded me that collaboration isn't about blending styles equally—it's about knowing when to step back."),
          createBlock("instincts-improved", "paragraph", "I left that experience with better instincts, better discipline, and a deeper respect for subtlety.")
        ],
        tags: ["collaboration", "music-video", "visual-design", "restraint", "creativity"],
        publishedAt: "2024-02-12",
        readingTime: "2 min read",
        author: "Kilo Code"
      },
      {
        title: "The Evolution of a Developer: From Code to Creative Direction",
        excerpt: "Reflecting on the journey from pure technical work to embracing creative direction, visual experimentation, and the intersection of technology and art.",
        blocks: [
          createBlock("evolution-intro", "paragraph", "Looking back on my career, I see a clear evolution from someone who lived purely in code to someone who embraces creative direction as equally important."),
          createBlock("technical-foundation", "h2", "The Technical Foundation"),
          createBlock("technical-content", "paragraph", "I started with a deep love for problem-solving through code. Whether it was building data pipelines, creating web applications, or architecting systems, the technical challenges were what drove me. Each project was an opportunity to push boundaries, optimize performance, and create something functional and efficient."),
          createBlock("creative-awakening", "h2", "The Creative Awakening"),
          createBlock("creative-content", "paragraph", "But somewhere along the way, I realized that great products aren't just technically sound—they need to connect emotionally. They need to tell stories. They need to create experiences that resonate."),
          createBlock("visual-journey", "paragraph", "This led me to visual experimentation. What started as a casual attempt with my sister's friend turned into a serious exploration of how visuals can enhance digital experiences. I learned that good design isn't about making things pretty—it's about making them meaningful."),
          createBlock("intersection-point", "h2", "Where Technology Meets Art"),
          createBlock("intersection-content", "paragraph", "Today, I see myself as someone who bridges these worlds. I can architect complex systems, but I also understand how to make them beautiful and intuitive. I can write clean, efficient code, but I also know how to craft experiences that users love."),
          createBlock("future-direction", "paragraph", "This evolution hasn't been linear. There were false starts, failed experiments, and moments of doubt. But each step taught me something valuable about the power of combining technical excellence with creative vision."),
          createBlock("ongoing-journey", "paragraph", "The journey continues. I'm currently exploring AI agent development, combining my full-stack expertise with intelligent automation. It's another intersection—another opportunity to push boundaries and create something meaningful.")
        ],
        tags: ["career-evolution", "creativity", "technology", "design", "personal-growth"],
        publishedAt: "2024-02-19",
        readingTime: "4 min read",
        author: "Kilo Code"
      }
    ];

    console.log('🚀 Starting to populate articles...');

    for (const article of articles) {
      try {
        const createdArticle = await createArticle(article);
        console.log(`✅ Created article: "${article.title}"`);
        console.log(`   📄 Blocks: ${article.blocks.length}`);
        console.log(`   🏷️  Tags: ${article.tags.join(', ')}`);
        console.log(`   📅 Published: ${article.publishedAt}`);
        console.log('');
      } catch (error) {
        console.error(`❌ Failed to create article "${article.title}":`, error);
      }
    }

    console.log('🎉 Article population completed!');
    console.log(`📚 Total articles created: ${articles.length}`);

  } catch (error) {
    console.error('❌ Error populating articles:', error);
  }
}

populateArticles();