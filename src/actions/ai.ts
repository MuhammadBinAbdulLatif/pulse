'use server'

import { GoogleGenAI } from "@google/genai";

// It's a good practice to validate environment variables at startup.
if (!process.env.GOOGLE_API_KEY) {
	console.error("FATAL: GOOGLE_API_KEY environment variable is not set.");
    // In a real application, you might want to prevent the server from even starting.
    // For this server action, we'll let it fail on execution.
}

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

export const generateCreativePrompt = async (userPrompt: string, noOfCards: number) => {
    // This prompt is simpler and more direct. It removes the need for dynamic string
    // manipulation in the code, making it cleaner and easier to maintain. The model
    // is instructed on the format and constraints directly.
	const finalPrompt = `
Generate a coherent and relevant presentation outline for the following prompt: "${userPrompt}".

The outline must consist of exactly ${noOfCards} points.
Each point must be a single, complete sentence.
The entire response must be a single, valid JSON object, without any surrounding text, explanations, or markdown formatting.
Remember to give NOTHING BUT JSON.
The JSON object must follow this structure:
{
  "outlines": [
    "point 1",
    "point 2",
    "..."
  ]
}
`;

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: [
            {
                role: "user",
                parts: [{ text: "You are an expert presentation assistant that generates outlines. You must only return a valid JSON object as requested, with nothing else. Just the JSON" + "\n\n" + finalPrompt }]
            }
        ],
			config: {
				maxOutputTokens: 1500, // Adjusted for potentially longer outlines
				temperature: 0.0    // Slightly increased for nuanced, yet consistent results
			}
		});

		 const responseContent = response.text;
        if (!responseContent) {
            console.error('AI response was empty.');
            return { status: 500, message: 'Received an empty response from the AI model.' };
        }

        // --- NEW LINE ADDED ---
        // Remove markdown code block delimiters if present
        const cleanResponseContent = responseContent.replace(/```json\n|```/g, '').trim();
        // --- END NEW LINE ADDED ---

        let jsonResponse;
        try {
            // Use the cleaned content for parsing
            jsonResponse = JSON.parse(cleanResponseContent);
        } catch (error) {
            console.error('Invalid JSON received from AI.', {
                content: responseContent, // Keep original content for logging
                errorMessage: (error as Error).message
            });
            return { status: 500, message: 'Invalid JSON format in the AI response.' };
        }

        // Add a validation layer to ensure the AI's output meets our structural requirements.
        const outlines = jsonResponse.outlines;
        if (!outlines || !Array.isArray(outlines) || outlines.length !== noOfCards) {
            console.warn('AI response validation failed.', {
                expectedCount: noOfCards,
                receivedCount: outlines?.length || 'undefined',
                receivedData: jsonResponse
            });
            // 422 Unprocessable Entity is a more specific status for a response that is
            // syntactically correct (valid JSON) but semantically wrong.
            return { status: 500, message: `AI failed to generate the required number of points.` };
        }

		return { status: 200, data: jsonResponse };

	} catch (error) {
		console.error("Error generating outlines from Google GenAI:", error);
		// Return a generic error to the client for security.
		return { status: 500, message: "An internal server error occurred." };
	}
};