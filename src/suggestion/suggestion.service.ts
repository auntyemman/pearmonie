import { IProduct } from '../product_store/product/product.model';
import { openai } from '../common/configs/openai';
import { logger } from '../common/configs/logger';
import { APIError } from '../common/utils/custom_error';

export class SuggestionService {
  constructor() {}

  // Use OpenAI to generate suggestions from the fetched products
  public async suggestProducts(userPreferences: string, products: IProduct[]): Promise<IProduct[]> {
    try {
      if (products.length === 0) {
        throw new Error('No products found for the given preferences');
      }

      // Step 2: Use OpenAI Chat API to generate ranking or filtering logic for these products
      const productNames = products.map((product) => product.name).join('\n');
      // const messages = [
      //   {
      //     role: 'system',
      //     content: `You are an expert product recommendation system. Suggest the best products based on user preferences.`,
      //   },
      //   {
      //     role: 'user',
      //     content: `Here is a list of products: \n${productNames}\nGiven the user's preferences: "${userPreferences}", suggest the top 5 products.`,
      //   },
      // ];

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // or 'gpt-4' depending on your subscription
        messages: [
          {
            role: 'system',
            content: `You are an expert product recommendation system. Suggest the best products based on user preferences.`,
          },
          {
            role: 'user',
            content: `Here is a list of products: \n${productNames}\nGiven the user's preferences: "${userPreferences}", suggest the top 5 products.`,
          },
        ],
        max_tokens: 100,
        temperature: 0.5,
        n: 1,
      });

      if (!response.choices[0]?.message?.content) {
        throw new Error('No response was generated from OpenAI');
      }

      // Extract the suggested product names from the AI response
      const completionText = response.choices[0].message.content.trim();
      const suggestedProductNames = completionText?.split('\n').map((name) => name.trim());

      // Step 3: Filter the original products based on the suggestions from OpenAI
      const suggestedProducts = products.filter((product) =>
        suggestedProductNames?.some((suggestedName) => product.name.includes(suggestedName)),
      );

      // If no suggestions are found, return the top 5 products by default
      return suggestedProducts.length > 0 ? suggestedProducts : products.slice(0, 5);
    } catch (error) {
      logger.error('Error generating product suggestions:', error);
      throw new APIError(
        'Failed to generate product suggestions, possibly due to OpenAI API limit',
      );
    }
  }
}
