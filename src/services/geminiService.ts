import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

export const generateLogoIdeas = async (
  businessName: string,
  industry: string,
  styles: string[],
  colors?: string[]
): Promise<LogoConcept[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Generate 4 professional logo design concepts for a ${industry} business named "${businessName}".
      Style preferences: ${styles.join(', ')}.
      ${colors ? `Color palette: ${colors.join(', ')}.` : ''}
      
      For each concept, provide:
      1. A detailed description of the logo design
      2. The design philosophy behind it
      3. Suggested color schemes
      4. Potential typography pairings
      
      Format your response as a JSON array with these properties:
      - id: string
      - description: string
      - designPhilosophy: string
      - colors: string[]
      - typography: string[]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response (Gemini may return markdown with ```json)
    const jsonStart = text.indexOf('```json') + 7;
    const jsonEnd = text.lastIndexOf('```');
    const jsonString = text.slice(jsonStart, jsonEnd).trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating logo ideas:", error);
    throw error;
  }
};

export const generateLogoPrompt = async (concept: LogoConcept): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Create a detailed prompt for an image generation API to create a logo based on:
      - Concept: ${concept.description}
      - Design Philosophy: ${concept.designPhilosophy}
      - Colors: ${concept.colors.join(', ')}
      - Typography: ${concept.typography.join(', ')}
      
      The prompt should be extremely detailed about:
      - Logo style and composition
      - Color usage and combinations
      - Typography treatment
      - Any symbolic elements
      - Background requirements
      
      Return just the prompt as a single string.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating logo prompt:", error);
    throw error;
  }
};

interface LogoConcept {
  id: string;
  description: string;
  designPhilosophy: string;
  colors: string[];
  typography: string[];
}