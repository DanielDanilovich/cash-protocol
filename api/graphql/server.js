/* CASH Protocol — GraphQL Server */
'use strict';

// Minimal GraphQL server without external dependencies
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.GRAPHQL_PORT || 4000;

const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const resolvers = {
  health: () => ({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime(),
  }),
  sovereign: () => ({
    address: 'CASH_CA8AED23F0FF66068107BD95F696EB73B57FE95A8881570883ADA5FD4CB25173',
    signature: 'BEST REGARDS, ALEKSEY DANIEL DANILOVICH AND MY WIVES',
    totalSupply: '10000000000000',
    genesisTimestamp: 1774572780,
  }),
  rate: (_, { from, to }) => ({
    from,
    to,
    rate: 20.0,
    source: 'internal',
  }),
  blockchainStats: () => ({
    chainLength: 1,
    pendingTransactions: 0,
    totalSupply: '10000000000000',
    sovereignBalance: 3300000000000,
  }),
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/graphql' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { query, variables } = JSON.parse(body);
        // Simple query parser (demo)
        const result = { data: {} };

        if (query.includes('health')) result.data.health = resolvers.health();
        if (query.includes('sovereign')) result.data.sovereign = resolvers.sovereign();
        if (query.includes('blockchainStats')) result.data.blockchainStats = resolvers.blockchainStats();
        if (query.includes('rate')) result.data.rate = resolvers.rate(null, { from: 'CASH', to: 'EUR' });

        res.end(JSON.stringify(result));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ errors: [{ message: e.message }] }));
      }
    });
  } else if (req.url === '/graphql' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    res.end(`<!DOCTYPE html>
<html><head><title>CASH GraphQL</title></head><body>
<h1>CASH Protocol — GraphQL API</h1>
<p>Send POST requests to /graphql</p>
<p>Example: <code>{"query": "{ health { status version } }"}</code></p>
</body></html>`);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`[GraphQL] Server running on port ${PORT}`);
  console.log(`[GraphQL] Playground: http://localhost:${PORT}/graphql`);
});

module.exports = { server, resolvers, schema };
