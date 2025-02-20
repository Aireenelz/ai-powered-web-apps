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

/*app.post('/describe', async (req, res) => {
    try {
        const { base64ImageData, imageType, descriptionLength } = req.body;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',  // OpenAI endpoint
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    // Prompt engineering
                    { role: 'system', content: 'You are an image describer. When given the base64 encoding of an image, provide an accurate description.' },
                    // User prompt
                    { role: 'user', content: `Describe the image in ${descriptionLength} words: ${base64ImageData}` },
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
        res.status(500).json({ error: error.response?.data || error.message });
    }
});*/

app.post('/describe', async (req, res) => {
    try {
        const { base64ImageData, descriptionLength } = req.body;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',  
            {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are an AI that describes images accurately.' },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url', 
                                image_url: { url: `data:image/jpeg;base64,${base64ImageData}` }
                            },
                            {
                                type: 'text',
                                text: `Describe the image in ${descriptionLength} words.`
                            }
                        ]
                    }
                ],
                max_tokens: 300,
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});