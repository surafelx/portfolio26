import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config();

async function migrateNotes() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('portfolio26');
    const notesCollection = db.collection('notes');

    console.log('🔄 Starting notes migration...');

    // Find all notes that have content but no blocks
    const notesToMigrate = await notesCollection.find({
      content: { $exists: true },
      $or: [
        { blocks: { $exists: false } },
        { blocks: { $size: 0 } }
      ]
    }).toArray();

    console.log(`📝 Found ${notesToMigrate.length} notes to migrate`);

    for (const note of notesToMigrate) {
      const blocks = [{
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'paragraph' as const,
        content: note.content,
        metadata: {}
      }];

      await notesCollection.updateOne(
        { _id: note._id },
        {
          $set: { blocks },
          $unset: { content: 1 }
        }
      );

      console.log(`✅ Migrated note: ${note.title}`);
    }

    console.log('🎉 Notes migration completed!');

    // Verify migration
    const migratedCount = await notesCollection.countDocuments({
      blocks: { $exists: true, $ne: [] }
    });

    const oldFormatCount = await notesCollection.countDocuments({
      content: { $exists: true }
    });

    console.log(`📊 Migration results:`);
    console.log(`   ✅ Notes with blocks: ${migratedCount}`);
    console.log(`   ⚠️  Notes with old content: ${oldFormatCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.close();
  }
}

migrateNotes();