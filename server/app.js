import { createServer } from 'http';
import socketIO from 'socket.io';
import path from 'path';

export const initApp = (app) => {
  const http = createServer(app);
  const io = socketIO(http);

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
  });

  const PORT = process.env.PORT || 3000;

  http.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });

  return app;
};
