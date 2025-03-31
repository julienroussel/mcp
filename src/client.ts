// eslint-disable-next-line import/no-unresolved
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
// eslint-disable-next-line import/no-unresolved
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import 'dotenv/config';

const transport = new SSEClientTransport(new URL('http://localhost:3001/sse'));

const client = new Client({
  name: 'example-client',
  version: '1.0.0',
});

await client.connect(transport);

const list = await client.listTools();
console.log(list.tools.map((tool) => tool.name));

const response = await client.callTool({
  name: 'geocode',
  arguments: {
    address: '2 rue de Rivoli Paris',
  },
});

console.log(response);

client.close();
