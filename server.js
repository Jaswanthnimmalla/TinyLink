const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://${hostname}:${port}`,
      methods: ['GET', 'POST'],
    },
  });

  // Store io instance globally for use in API routes
  global.io = io;

  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });

    socket.on('subscribe', (data) => {
      console.log('📡 Client subscribed:', data);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 TinyLink Server Ready!                                ║
║                                                            ║
║   ➜ Local:   http://${hostname}:${port}                      ║
║   ➜ Network: http://0.0.0.0:${port}                         ║
║                                                            ║
║   ✅ Next.js Server: Running                               ║
║   ✅ Socket.io: Connected                                  ║
║   ✅ Real-time Notifications: Active                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
});
