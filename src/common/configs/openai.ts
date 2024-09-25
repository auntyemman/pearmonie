import OpenAI from 'openai';
import { OPENAI_ORG_ID, OPENAI_PROJECT_ID, OPENAI_KEY } from '.';

export const openai = new OpenAI({
  organization: OPENAI_ORG_ID,
  project: OPENAI_PROJECT_ID,
  apiKey: OPENAI_KEY,
});
