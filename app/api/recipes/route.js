import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const items = url.searchParams.get('items');

    if (!items) {
      return new Response('Items parameter is required', { status: 400 });
    }

    const prompt = `Provide 3 different but simple recipes using the available ingredients: ${items}. List each meal separately (leave space) and under the heading Meal + the number of the meal. Make sure the suggestions are appropriate and typical meals. End each recipe with 'Enjoy!' on a new line`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.9
    });

    const recipes = response.choices[0].message.content
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('Recipe'))
      .map(line => line.trim());

    return new Response(JSON.stringify(recipes), { status: 200 });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
