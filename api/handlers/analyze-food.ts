import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import OpenAI from 'openai';
import { NUTRITION_ANALYSIS_PROMPT, NUTRITION_ANALYSIS_PROMPT_WITH_PHOTO } from '../../utils/prompts';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeFood(req: Request, res: Response) {
    try {
        const { description } = req.body;
        console.log(req.files);
        let photo = req.files?.photo as UploadedFile;

        if (!description && !photo) {
            return res.status(400).send({ error: 'Description or photo are required' });
        }
        let response;
        if (photo) {
            let bufferData = Buffer.from(photo.data.toString('base64'));
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
}