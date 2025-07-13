const { StreamChat } = require('stream-chat');

// Use environment variables directly instead of importing config


module.exports = {
  async up(db) {

    
    console.log('Starting StreamChat user registration...');
    const client = StreamChat.getInstance("4ngq5ws5e4b8", "enhpheay7z2d4j86aftgch8xjd58hrnpazpaxzhuhhn5ktayjbmxtxvya4nsnkb4");

    const users = await db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users in database`);
    
    const streamUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      image: user.avatar,
      email: user.email,
    }));

    // Register users in batches to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < streamUsers.length; i += batchSize) {
      const batch = streamUsers.slice(i, i + batchSize);
      try {
        await client.upsertUsers(batch);
        console.log(`✅ Registered users ${i + 1} to ${i + batch.length} in StreamChat`);
      } catch (error) {
        console.error(`❌ Failed to register batch ${i + 1} to ${i + batch.length}:`, error.message);
      }
    }
    
    console.log('StreamChat user registration completed!');
  },

  async down(db) {
    if (!apiKey || !apiSecret) {
      throw new Error('Stream API key/secret not set in environment variables (STREAM_API_KEY, STREAM_API_SECRET)');
    }
    
    console.log('Starting StreamChat user deletion...');
    const client = StreamChat.getInstance(apiKey, apiSecret);

    const users = await db.collection('users').find({}).toArray();
    const userIds = users.map(user => user._id.toString());

    // Remove users from StreamChat in batches
    const batchSize = 50;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      try {
        await client.deleteUsers(batch, { hard_delete: true });
        console.log(`✅ Deleted users ${i + 1} to ${i + batch.length} from StreamChat`);
      } catch (error) {
        console.error(`❌ Failed to delete batch ${i + 1} to ${i + batch.length}:`, error.message);
      }
    }
    
    console.log('StreamChat user deletion completed!');
  }
};