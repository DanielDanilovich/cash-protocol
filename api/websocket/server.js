/* CASH Protocol — WebSocket Streaming Server */
'use strict';

const http = require('http');
const crypto = require('crypto');

const PORT = process.env.WS_PORT || 8080;

const clients = new Set();
const channels = new Map();

// Minimal WebSocket implementation (RFC 6455)
function handleUpgrade(req, socket) {
  const key = req.headers['sec-websocket-key'];
  const acceptKey = crypto
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');

  socket.write([
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    'Sec-WebSocket-Accept: ' + acceptKey,
    '', ''
  ].join('\r\n'));

  const client = { socket, channels: new Set() };
  clients.add(client);

  socket.on('data', (buf) => {
    const decoded = decodeFrame(buf);
    if (!decoded) return;
    try {
      const msg = JSON.parse(decoded);
      if (msg.action === 'subscribe') {
        client.channels.add(msg.channel);
        if (!channels.has(msg.channel)) channels.set(msg.channel, new Set());
        channels.get(msg.channel).add(client);
        sendToClient(client, { type: 'subscribed', channel: msg.channel });
      } else if (msg.action === 'unsubscribe') {
        client.channels.delete(msg.channel);
        if (channels.has(msg.channel)) channels.get(msg.channel).delete(client);
      }
    } catch (e) {
      sendToClient(client, { type: 'error', message: e.message });
    }
  });

  socket.on('close', () => {
    clients.delete(client);
    client.channels.forEach(ch => {
      if (channels.has(ch)) channels.get(ch).delete(client);
    });
  });

  sendToClient(client, {
    type: 'welcome',
    version: '1.0.0',
    channels: ['blocks', 'transactions', 'rates'],
  });
}

function decodeFrame(buf) {
  try {
    const firstByte = buf[0];
    const secondByte = buf[1];
    const opcode = firstByte & 0x0f;
    if (opcode === 0x8) return null; // close
    const masked = (secondByte & 0x80) !== 0;
    let payloadLen = secondByte & 0x7f;
    let offset = 2;
    if (payloadLen === 126) { payloadLen = buf.readUInt16BE(2); offset = 4; }
    else if (payloadLen === 127) { payloadLen = Number(buf.readBigUInt64BE(2)); offset = 10; }
    let maskKey = null;
    if (masked) { maskKey = buf.slice(offset, offset + 4); offset += 4; }
    const payload = buf.slice(offset, offset + payloadLen);
    if (masked) {
      for (let i = 0; i < payload.length; i++) payload[i] ^= maskKey[i % 4];
    }
    return payload.toString('utf8');
  } catch { return null; }
}

function encodeFrame(text) {
  const payload = Buffer.from(text, 'utf8');
  const len = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x81;
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, payload]);
}

function sendToClient(client, msg) {
  try {
    client.socket.write(encodeFrame(JSON.stringify(msg)));
  } catch { /* ignore */ }
}

function broadcast(channel, msg) {
  const subs = channels.get(channel);
  if (!subs) return;
  const data = JSON.stringify({ type: 'event', channel, data: msg });
  subs.forEach(client => sendToClient(client, JSON.parse(data)));
}

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    status: 'ok',
    service: 'CASH WebSocket',
    channels: ['blocks', 'transactions', 'rates'],
    connected_clients: clients.size,
  }));
});

server.on('upgrade', handleUpgrade);
server.listen(PORT, () => {
  console.log(`[WebSocket] Server running on port ${PORT}`);
  console.log(`[WebSocket] Connect: ws://localhost:${PORT}`);
});

// Simulated events
setInterval(() => {
  if (clients.size > 0) {
    broadcast('rates', {
      from: 'CASH', to: 'EUR', rate: 20.0, ts: Date.now()
    });
  }
}, 10000);

module.exports = { server, broadcast };
