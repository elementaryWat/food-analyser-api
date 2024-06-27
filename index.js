const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
    res.send('Hello World from Food Analyser!');
});

// Define the endpoint to analyze food descriptions
app.post('/api/analyze-food', async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) {
            return res.status(400).send({ error: 'Food description is required' });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a Nutritionist AI, dedicated to helping users understand macronutrient breakdown (carbohydrates, proteins, fats) and calories of a given plate description. return a json with the macros and calories."
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