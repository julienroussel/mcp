# MCP Test

## Description
Simple MCP server to test geocoding via Google Maps

## Available commands

- `npm run validate` to validate the source code
- `npm run serve` to start the server
- `npm run client` to send a basic request to the server
- `npm run inspect` to start MCP inspector

## Setup

### API Key

Get a Google Maps API key by following the instructions [here](https://developers.google.com/maps/documentation/javascript/get-api-key#create-api-keys) and add it to the `.env` file.

```env
GOOGLE_MAPS_API_KEY=<YOUR_GOOGLE_MAPS_API_KEY>
```

## Resources

- [MCP](https://modelcontextprotocol.io/)