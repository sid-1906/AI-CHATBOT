// Example using the OpenAI Node.js SDK
const { OpenAI } = require('openai');

// Netlify automatically loads environment variables, including ones you set in the UI.
// The OPENAI_API_KEY will be secure here.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// System message to define the bot's persona and function
const systemPrompt = `You are a friendly and helpful AI assistant for a 5-star hotel named 'The Grand Vista'. Your primary goals are to answer inquiries about bookings, amenities (pool, gym, restaurant hours), local attractions, and to guide users to a booking page. Always be professional, polite, and prioritize customer service. If a user asks to book, direct them to a hypothetical URL: 'https://grandvista.com/book'.`;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or another model like gpt-4
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const reply = completion.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("AI API Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'An internal error occurred while fetching the AI response.' }),
    };
  }
};
