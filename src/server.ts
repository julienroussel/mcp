import express, { Request, Response } from 'express';
// eslint-disable-next-line import/no-unresolved
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// eslint-disable-next-line import/no-unresolved
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { AddressSchema, handleGeocode } from './google-maps';

const server = new McpServer(
  {
    name: 'mcp-server/google-maps',
    version: '0.0.1',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.tool(
  'geocode',
  'Convert an address into geographic coordinates',
  AddressSchema,
  async (args) => {
    const response = await handleGeocode(args);

    return {
      content: [
        {
          type: 'text',
          text: response.content,
        },
      ],
      isError: response.hasError,
    };
  },
);

const app = express();

const transports: { [sessionId: string]: SSEServerTransport } = {};

app.get('/sse', async (_: Request, res: Response) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  res.on('close', () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post('/messages', async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

app.listen(3001, () => {
  console.log('server started');
});
