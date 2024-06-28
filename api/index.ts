import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { NUTRITION_ANALYSIS_PROMPT, NUTRITION_ANALYSIS_PROMPT_WITH_PHOTO } from '../utils/prompts';
import fileUpload, { UploadedFile } from 'express-fileupload';
import fs from 'fs';

dotenv.config();

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

function encodeImage(imagePath: string): string {
    const image = fs.readFileSync(imagePath);
    console.log(image);
    return Buffer.from(image).toString('base64');
}


app.get('/api', (req: Request, res: Response) => {
    res.send('Hello World from Food Analyser!');
});

app.post('/api/analyze-food', async (req: Request, res: Response) => {
    try {
        const { description } = req.body;
        console.log(req.files);
        let photo = req.files?.photo as UploadedFile

        if (!description && !photo) {
            return res.status(400).send({ error: 'Description or photo are required' });
        }
        let response;
        if (photo) {
            let bufferData = Buffer.from(photo.data.toString('base64'))
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
                                    url: `data:${photo.mimetype};base64,${bufferData}`
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
