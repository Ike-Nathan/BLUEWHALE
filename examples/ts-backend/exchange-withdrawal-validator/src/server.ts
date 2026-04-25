import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/validate', (req, res) => {
  // Placeholder for address validation
  res.json({});
});

app.post('/api/analyze', (req, res) => {
  // Placeholder for address analysis
  res.json({});
});

app.listen(port, () => {
  console.log(`Exchange Withdrawal Validator listening at http://localhost:${port}`);
});
