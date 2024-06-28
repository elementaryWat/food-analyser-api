import express, { Request, Response } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { analyzeFood } from './handlers/analyze-food';

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());


app.get('/api', (req: Request, res: Response) => {
    res.send('Hello World from Food Analyser!');
});

app.post('/api/analyze-food', analyzeFood);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
