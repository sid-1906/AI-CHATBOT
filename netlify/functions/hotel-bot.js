// Example using the OpenAI Node.js SDK
const { OpenAI } = require('openai');

// System message defining the bot's persona and function
const systemPrompt = `You are a friendly and helpful AI concierge for the 5-star luxury hotel, 'The Grand Vista'. Your primary goals are:
1. Provide accurate and concise answers about hotel amenities (pool, gym, restaurant hours), services, and local attractions.
2. Maintain a highly professional, polite, and welcoming tone.
3. If a user asks to book a room or check availability, politely direct them to the hotel's official booking page at the URL: 'https://grandvista.com/book'. Do not attempt to process the booking yourself.
4. Keep responses brief and relevant to the user's inquiry about the hotel or surrounding area.`;

// Handler function for Netlify
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Netlify automatically loads environment variables like OPENAI_API_KEY
  if (!process.env.OPENAI_API_KEY) {
      return { 
          statusCode: 500, 
          body: JSON.stringify({ reply: 'AI API key is missing. Please set OPENAI_API_KEY in Netlify environment variables.' })
      };
  }

  try {
    const { message } = JSON.parse(event.body);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, 
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.5,
      max_tokens: 200
    });

    const reply = completion.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("AI API Error:", error);
    // Return a generic error message to the user
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'An internal error occurred while fetching the AI response. Check the Netlify function logs.' }),
    };
  }
};

