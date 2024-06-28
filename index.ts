import express, { Request, Response } from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { NUTRITION_ANALYSIS_PROMPT, NUTRITION_ANALYSIS_PROMPT_WITH_PHOTO } from './utils/prompts';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
    }
});

const upload = multer({ storage: storage });

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

function encodeImage(imagePath: string): string {
    const image = fs.readFileSync(imagePath);
    console.log(image);
    return Buffer.from(image).toString('base64');
}

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World from Food Analyser!');
});

app.post('/api/analyze-food', upload.single('photo'), async (req: Request, res: Response) => {
    try {
        const { description } = req.body;
        if (!description && !req.file?.path) {
            return res.status(400).send({ error: 'Description or photo are required' });
        }
        let response;
        if (req.file) {
            const base64Image = encodeImage((req.file as any).path);
            response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: NUTRITION_ANALYSIS_PROMPT_WITH_PHOTO },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                temperature: 0.5,
                max_tokens: 1000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                response_format: {
                    type: "json_object"
                }
            });
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error("Error deleting the file:", err);
                }
                console.log("File deleted successfully");
            });
        } else {
            console.log(description);
            response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: NUTRITION_ANALYSIS_PROMPT
                    },
                    {
                        role: "user",
                        content: description

                    }
                ],
                temperature: 0.5,
                max_tokens: 1000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                response_format: {
                    type: "json_object"
                }
            });
        }

        res.status(200).send(response.choices[0].message.content);


    } catch (error) {
        console.error('Failed to fetch response from OpenAI:', error);
        res.status(500).send({ error: 'Failed to analyze food description' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
