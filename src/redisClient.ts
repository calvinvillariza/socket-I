import { RedisClientType, createClient } from 'redis';

const client: RedisClientType = createClient({
    url: 'redis://localhost:6060',
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

client.connect();

export default client;