require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path'); // for serving static files

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // serves everything from root directory

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html')); // serve index.html on the root URL
});

app.post('/summarize', async (req, res) => {
    try {
        const { text, summaryLength } = req.body;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',  // OpenAI endpoint
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    // Prompt engineering
                    { role: 'system', content: 'You are a text summarizer. When asked to summarize a text, send back the summary of it. Please only send back the summary without prefixing it with things like "Summary" or telling where the text is from. Also give me the summary as if the original author wrote it and without using a third person voice.' },
                    // User prompt
                    { role: 'user', content: `Summarize the following text into ${summaryLength} words: ${text}` },
                ],
                max_tokens: 200,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});