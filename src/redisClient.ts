import { createClient } from 'redis';

const client = createClient({
    url: 'redis://localhost:6060',
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

client.connect();

export default client;