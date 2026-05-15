import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Real-time Contest Logic
  const rooms = new Map();

  io.on('connection', (socket) => {
    socket.on('join-contest', ({ contestId, user }) => {
      socket.join(contestId);
      if (!rooms.has(contestId)) {
        rooms.set(contestId, new Map());
      }
      rooms.get(contestId).set(socket.id, { 
        ...user,
        wpm: 0, 
        accuracy: 0, 
        progress: 0 
      });
      
      const room = rooms.get(contestId);
      const participants = Array.from(room.entries()).map(([id, data]) => ({
        id,
        ...data as object
      }));
      io.to(contestId).emit('contest-leaderboard', participants);
    });

    socket.on('typing-update', ({ contestId, stats }) => {
      const room = rooms.get(contestId);
      if (room) {
        const currentUser = room.get(socket.id);
        if (currentUser) {
          room.set(socket.id, { ...currentUser, ...stats });
          const participants = Array.from(room.entries()).map(([id, data]) => ({
            id,
            ...data as object
          }));
          io.to(contestId).emit('contest-leaderboard', participants);
        }
      }
    });

    socket.on('disconnect', () => {
      rooms.forEach((room, contestId) => {
        if (room.has(socket.id)) {
          room.delete(socket.id);
          const participants = Array.from(room.entries()).map(([id, data]) => ({
            id,
            ...data as object
          }));
          io.to(contestId).emit('contest-leaderboard', participants);
        }
      });
    });
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Certificate Generation
  app.post('/api/certificates/generate', async (req, res) => {
    const { name, wpm, accuracy, date, userId } = req.body;
    const certId = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    try {
      const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
      const qrData = await QRCode.toDataURL(`https://typogram.app/verify/${certId}`);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Typogram_Certificate_${userId}.pdf`);
      
      doc.pipe(res);
      
      // Cyberpunk Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0B0F19');
      
      // Neon Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#00F3FF');
      doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke('#8B5CF6');

      // Title
      doc.fillColor('#00F3FF').fontSize(50).text('CERTIFICATE OF MASTERY', 0, 100, { align: 'center' });
      doc.fillColor('#FFFFFF').fontSize(20).text('This is to certify that', 0, 180, { align: 'center' });
      
      // Name
      doc.fillColor('#8B5CF6').fontSize(40).text(name.toUpperCase(), 0, 220, { align: 'center' });
      
      // Details
      doc.fillColor('#FFFFFF').fontSize(20).text(`has achieved an elite typing level on TYPOGRAM`, 0, 280, { align: 'center' });
      
      // Stats
      doc.fontSize(30).fillColor('#00F3FF').text(`${wpm} WPM`, 200, 350);
      doc.fontSize(15).fillColor('#FFFFFF').text('SPEED', 200, 385);
      
      doc.fontSize(30).fillColor('#00FF95').text(`${accuracy}%`, 500, 350);
      doc.fontSize(15).fillColor('#FFFFFF').text('ACCURACY', 500, 385);

      // QR Code
      doc.image(qrData, 700, 450, { width: 100 });
      doc.fontSize(10).fillColor('#FFFFFF').text(`Verification ID: ${certId}`, 700, 560);
      
      doc.fontSize(10).text(`Date: ${date}`, 50, 530);
      doc.fontSize(10).text('Authorized by MiraCore Logix', 50, 550);

      doc.end();
    } catch (err) {
      console.error(err);
      res.status(500).send('Error generating certificate');
    }
  });

  // AI Help Center proxy
  app.post('/api/ai/help', async (req, res) => {
    const { prompt } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'AI key not configured' });
    }
    
    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const model = (genAI as any).getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const systemPrompt = `You are Typogram AI Assistant. Typogram is a cyberpunk neon typing platform. 
      Help users with typing tips, site features (Practice, Contests, Certificates, Coins, Levels), 
      and technical issues. Keep responses concise, futuristic, and helpful. 
      Platform Info: 30 BDT for Premium Digital Cert, 100 BDT for Physical. bKash/Nagad supported.`;
      
      const result = await model.generateContent([systemPrompt, prompt]);
      res.json({ response: result.response.text() });
    } catch (err) {
      res.status(500).json({ error: 'AI processing failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
