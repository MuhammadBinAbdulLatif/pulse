"use server";
import { GoogleGenAI  } from "@google/genai";
import { onAuthenticateUser } from "./User";
import { client } from "@/lib/prisma";
import {  ContentType, } from "@/lib/types";

import { v4 as uuidv4 } from "uuid";
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
// It's a good practice to validate environment variables at startup.
if (!process.env.GOOGLE_API_KEY) {
  console.error("FATAL: GOOGLE_API_KEY environment variable is not set.");
  // In a real application, you might want to prevent the server from even starting.
  // For this server action, we'll let it fail on execution.
}


export const generateCreativePrompt = async (
  userPrompt: string,
  noOfCards: number
) => {
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
          parts: [
            {
              text:
                "You are an expert presentation assistant that generates outlines. You must only return a valid JSON object as requested, with nothing else. Just the JSON" +
                "\n\n" +
                finalPrompt,
            },
          ],
        },
      ],
      config: {
        maxOutputTokens: 1500, // Adjusted for potentially longer outlines
        temperature: 0.0, // Slightly increased for nuanced, yet consistent results
      },
    });

    const responseContent = response.text;
    if (!responseContent) {
      console.error("AI response was empty.");
      return {
        status: 500,
        message: "Received an empty response from the AI model.",
      };
    }

    // --- NEW LINE ADDED ---
    // Remove markdown code block delimiters if present
    const cleanResponseContent = responseContent
      .replace(/```json\n|```/g, "")
      .trim();
    // --- END NEW LINE ADDED ---

    let jsonResponse;
    try {
      // Use the cleaned content for parsing
      jsonResponse = JSON.parse(cleanResponseContent);
    } catch (error) {
      console.error("Invalid JSON received from AI.", {
        content: responseContent, // Keep original content for logging
        errorMessage: (error as Error).message,
      });
      return {
        status: 500,
        message: "Invalid JSON format in the AI response.",
      };
    }

    // Add a validation layer to ensure the AI's output meets our structural requirements.
    const outlines = jsonResponse.outlines;
    if (
      !outlines ||
      !Array.isArray(outlines) ||
      outlines.length !== noOfCards
    ) {
      console.warn("AI response validation failed.", {
        expectedCount: noOfCards,
        receivedCount: outlines?.length || "undefined",
        receivedData: jsonResponse,
      });
      // 422 Unprocessable Entity is a more specific status for a response that is
      // syntactically correct (valid JSON) but semantically wrong.
      return {
        status: 500,
        message: `AI failed to generate the required number of points.`,
      };
    }

    return { status: 200, data: jsonResponse };
  } catch (error) {
    console.error("Error generating outlines from Google GenAI:", error);
    // Return a generic error to the client for security.
    return { status: 500, message: "An internal server error occurred." };
  }
};
// const findImageComponents = (layout: ContentItem): ContentItem[]=> {
//   const images = []
//   if(layout.type === 'image' ){
//     images.push(layout)
//   }
//   if(Array.isArray(layout.content)){
//     layout.content.forEach((child)=> {
//       images.push(...findImageComponents(child as ContentItem))
//     })
//   } else if (layout.content && typeof layout.content === 'object'){
//     images.push(...findImageComponents(layout.content))
//   }
//   return images
// }


// const generateImageUrl = async (prompt: string)=> {
//   const improvedPrompt = `
// Create a highly realistic, professional image based on the following description. The image should look as if captured in real life, with attention to detail, lighting, and texture.

// Description: ${prompt}

// Important Notes:
// - The image must be in a photorealistic style and visually compelling.
// - Ensure all text, signs, or visible writing in the image are in English.
// - Pay special attention to lighting, shadows, and textures to make the image as lifelike as possible.
// - Avoid elements that appear abstract, cartoonish, or overly artistic. The image should be suitable for professional presentations.
// - Focus on accurately depicting the concept described, including specific objects, environment, mood, and context. Maintain relevance to the description provided.

// Example Use Cases: Business presentations, educational slides, professional designs.
// `;
// try {
//   const geminiResponse = await openai.images.generate({
//   prompt: improvedPrompt,
//   n: 1,
//   size: '1024x1024'
// })
// if(!geminiResponse.data){
//   return {status: 400, error: 'Error generating the image'}
// }
// console.log('Image generated successfully', geminiResponse.data[0].url)
// return geminiResponse.data[0]?.url || 'https://via.placeholder.com/1024'
// }
//  catch (error) {
//   console.error('Failed to generate image', error)
//   return 'https://via.placeholder.com/1024'  
// }
// }



// const replaceImagePlaceholders = async (layout: Slide)=> {
//   const imageComponents = findImageComponents(layout.content)
//   console.log('found image components', imageComponents)
//   for (const component of imageComponents) {
//     console.log('Generating image for component:', component.alt)
//     component.content = await generateImageUrl(component.alt || 'Placeholder Image')
//   }
// }

const existingLayouts = [
    {
      id: uuidv4(),
      slideName: 'Blank card',
      type: 'blank-card',
      className: 'p-8 mx-auto flex justify-center items-center min-h-[200px]',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'title' as ContentType,
            name: 'Title',
            content: '',
            placeholder: 'Untitled Card',
          },
        ],
      },
    },
  
    {
      id: uuidv4(),
      slideName: 'Accent left',
      type: 'accentLeft',
      className: 'min-h-[300px]',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        restrictDropTo: true,
        content: [
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Resizable column',
            restrictToDrop: true,
            content: [
              {
                id: uuidv4(),
                type: 'image' as ContentType,
                name: 'Image',
                content:
                  'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                alt: 'Title',
              },
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'heading1' as ContentType,
                    name: 'Heading1',
                    content: '',
                    placeholder: 'Heading1',
                  },
                  {
                    id: uuidv4(),
                    type: 'paragraph' as ContentType,
                    name: 'Paragraph',
                    content: '',
                    placeholder: 'start typing here',
                  },
                ],
                className: 'w-full h-full p-8 flex justify-center items-center',
                placeholder: 'Heading1',
              },
            ],
          },
        ],
      },
    },
  
    {
      id: uuidv4(),
      slideName: 'Accent Right',
      type: 'accentRight',
      className: 'min-h-[300px]',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Resizable column',
            restrictToDrop: true,
            content: [
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'heading1' as ContentType,
                    name: 'Heading1',
                    content: '',
                    placeholder: 'Heading1',
                  },
                  {
                    id: uuidv4(),
                    type: 'paragraph' as ContentType,
                    name: 'Paragraph',
                    content: '',
                    placeholder: 'start typing here',
                  },
                ],
                className: 'w-full h-full p-8 flex justify-center items-center',
                placeholder: 'Heading1',
              },
              {
                id: uuidv4(),
                type: 'image' as ContentType,
                name: 'Image',
                restrictToDrop: true,
                content:
                  'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                alt: 'Title',
              },
            ],
          },
        ],
      },
    },
  
    // {
    //   id: uuidv4(),
    //   slideName: 'Image and text',
    //   type: 'imageAndText',
    //   className: 'min-h-[200px] p-8 mx-auto flex justify-center items-center',
    //   content: {
    //     id: uuidv4(),
    //     type: 'column' as ContentType,
    //     name: 'Column',
    //     content: [
    //       {
    //         id: uuidv4(),
    //         type: 'resizable-column' as ContentType,
    //         name: 'Image and text',
    //         className: 'border',
    //         content: [
    //           {
    //             id: uuidv4(),
    //             type: 'column' as ContentType,
    //             name: 'Column',
    //             content: [
    //               {
    //                 id: uuidv4(),
    //                 type: 'image' as ContentType,
    //                 name: 'Image',
    //                 className: 'p-3',
    //                 content:
    //                   'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //                 alt: 'Title',
    //               },
    //             ],
    //           },
    //           {
    //             id: uuidv4(),
    //             type: 'column' as ContentType,
    //             name: 'Column',
    //             content: [
    //               {
    //                 id: uuidv4(),
    //                 type: 'heading1' as ContentType,
    //                 name: 'Heading1',
    //                 content: '',
    //                 placeholder: 'Heading1',
    //               },
    //               {
    //                 id: uuidv4(),
    //                 type: 'paragraph' as ContentType,
    //                 name: 'Paragraph',
    //                 content: '',
    //                 placeholder: 'start typing here',
    //               },
    //             ],
    //             className: 'w-full h-full p-8 flex justify-center items-center',
    //             placeholder: 'Heading1',
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  
    // {
    //   id: uuidv4(),
    //   slideName: 'Text and image',
    //   type: 'textAndImage',
    //   className: 'min-h-[200px] p-8 mx-auto flex justify-center items-center',
    //   content: {
    //     id: uuidv4(),
    //     type: 'column' as ContentType,
    //     name: 'Column',
    //     content: [
    //       {
    //         id: uuidv4(),
    //         type: 'resizable-column' as ContentType,
    //         name: 'Text and image',
    //         className: 'border',
    //         content: [
    //           {
    //             id: uuidv4(),
    //             type: 'column' as ContentType,
    //             name: '',
    //             content: [
    //               {
    //                 id: uuidv4(),
    //                 type: 'heading1' as ContentType,
    //                 name: 'Heading1',
    //                 content: '',
    //                 placeholder: 'Heading1',
    //               },
    //               {
    //                 id: uuidv4(),
    //                 type: 'paragraph' as ContentType,
    //                 name: 'Paragraph',
    //                 content: '',
    //                 placeholder: 'start typing here',
    //               },
    //             ],
    //             className: 'w-full h-full p-8 flex justify-center items-center',
    //             placeholder: 'Heading1',
    //           },
    //           {
    //             id: uuidv4(),
    //             type: 'column' as ContentType,
    //             name: 'Column',
    //             content: [
    //               {
    //                 id: uuidv4(),
    //                 type: 'image' as ContentType,
    //                 name: 'Image',
    //                 className: 'p-3',
    //                 content:
    //                   'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //                 alt: 'Title',
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  
    {
      id: uuidv4(),
      slideName: 'Two columns',
      type: 'twoColumns',
      className: 'p-4 mx-auto flex justify-center items-center',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'title' as ContentType,
            name: 'Title',
            content: '',
            placeholder: 'Untitled Card',
          },
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Text and image',
            className: 'border',
            content: [
              {
                id: uuidv4(),
                type: 'paragraph' as ContentType,
                name: 'Paragraph',
                content: '',
                placeholder: 'Start typing...',
              },
              {
                id: uuidv4(),
                type: 'paragraph' as ContentType,
                name: 'Paragraph',
                content: '',
                placeholder: 'Start typing...',
              },
            ],
          },
        ],
      },
    },
  
    {
      id: uuidv4(),
      slideName: 'Two columns with headings',
      type: 'twoColumnsWithHeadings',
      className: 'p-4 mx-auto flex justify-center items-center',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'title' as ContentType,
            name: 'Title',
            content: '',
            placeholder: 'Untitled Card',
          },
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Text and image',
            className: 'border',
            content: [
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'heading3' as ContentType,
                    name: 'Heading3',
                    content: '',
                    placeholder: 'Heading 3',
                  },
                  {
                    id: uuidv4(),
                    type: 'paragraph' as ContentType,
                    name: 'Paragraph',
                    content: '',
                    placeholder: 'Start typing...',
                  },
                ],
              },
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'heading3' as ContentType,
                    name: 'Heading3',
                    content: '',
                    placeholder: 'Heading 3',
                  },
                  {
                    id: uuidv4(),
                    type: 'paragraph' as ContentType,
                    name: 'Paragraph',
                    content: '',
                    placeholder: 'Start typing...',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  
    // {
    //   id: uuidv4(),
    //   slideName: 'Three column',
    //   type: 'threeColumns',
    //   className: 'p-4 mx-auto flex justify-center items-center',
    //   content: {
    //     id: uuidv4(),
    //     type: 'column' as ContentType,
    //     name: 'Column',
    //     content: [
    //       {
    //         id: uuidv4(),
    //         type: 'title' as ContentType,
    //         name: 'Title',
    //         content: '',
    //         placeholder: 'Untitled Card',
    //       },
    //       {
    //         id: uuidv4(),
    //         type: 'resizable-column' as ContentType,
    //         name: 'Text and image',
    //         className: 'border',
    //         content: [
    //           {
    //             id: uuidv4(),
    //             type: 'paragraph' as ContentType,
    //             name: '',
    //             content: '',
    //             placeholder: 'Start typing...',
    //           },
    //           {
    //             id: uuidv4(),
    //             type: 'paragraph' as ContentType,
    //             name: '',
    //             content: '',
    //             placeholder: 'Start typing...',
    //           },
    //           {
    //             id: uuidv4(),
    //             type: 'paragraph' as ContentType,
    //             name: '',
    //             content: '',
    //             placeholder: 'Start typing...',
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  ]

const generateLayoutsJson = async (outlineArray: string)=> {
    const prompt = `"You are a highly creative AI that generates JSON-based layouts for presentations. "
    "I will provide you with an array of outlines, and for each outline, you must generate a unique and creative layout. "
    "Use the existing layouts as examples for structure and design, and generate unique designs based on the provided outline. "
    "### Guidelines: "
    "1. Write layouts based on the specific outline provided. "
    "2. Use diverse and engaging designs, ensuring each layout is unique. "
    "3. Adhere to the structure of existing layouts but add new styles or components if needed. "
    "4. Fill placeholder data into content fields where required. "
    "5. Generate unique image placeholders for the 'content' property of image components and also alt text according to the outline. "
    "6. Ensure proper formatting and schema alignment for the output JSON. "
    "### Example Layouts: "
    "${JSON.stringify(existingLayouts, null, 2)} "
    "### Outline Array: "
    "${JSON.stringify(outlineArray)} "
    "For each entry in the outline array, generate: "
    "- A unique JSON layout with creative designs. "
    "- Properly filled content, including placeholders for image components. "
    "- Clear and well-structured JSON data. "
    "For Images "
    "- The alt text should describe the image clearly and concisely. "
    "- Focus on the main subject(s) of the image and any relevant details such as colors, shapes, people, or objects. "
    "- Ensure the alt text aligns with the context of the presentation slide it will be used on (e.g., professional, educational, business-related). "
    "- Avoid using terms like \"image of\" or \"picture of,\" and instead focus directly on the content and meaning. "
    "Output the layouts in JSON format. Ensure there are no duplicate layouts across the array."`
    try {
      console.log('Generating layouts.')
     const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "You are an expert presentation assistant that generates outlines. You must only return a valid JSON object as requested, with nothing else. Just the JSON" +
                "\n\n" +
                prompt,
            },
          ],
        },
      ],
      config: {
        maxOutputTokens: 15000, // Adjusted for potentially longer outlines
        temperature: 0.7, // Slightly increased for nuanced, yet consistent results
      },
    });
      const responseContent = response.text;
      if(!responseContent){
        return {status: 400, error: 'No content generated'}
      }
      let jsonResponse;
      try {
        const cleanResponseContent = responseContent
      .replace(/```json\n|```/g, "")
      .trim();
        jsonResponse = JSON.parse(cleanResponseContent)
        // await Promise.all(jsonResponse.map(replaceImagePlaceholders))
        console.log(cleanResponseContent)
      } catch (error) {
        console.log('Error:', error)
        throw new Error('Invalid Json format received from AI')
      }
      if(!jsonResponse){
        return {status: 401, error: 'Errro creating Presentation, JSON not parsed'}

      }
      return {status: 200, data: jsonResponse}
    } catch (error) {
      console.error("Error generating slides from Google GenAI:", error);
    // Return a generic error to the client for security.
    return { status: 500, message: "An internal server error occurred." };
    }
}

export const generateLayouts = async (projectId: string, theme: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }
    const checkUser = await onAuthenticateUser();
    if (checkUser?.status !== 200 || !checkUser?.user || !checkUser.user.subscription) {
      return { status: 403, error: "User not authenticated" };
    }
    const project = await client.project.findUnique({
        where: {
            id: projectId,
            isDeleted: false
        }
    })
    if(!project){
        return {status: 404, error: 'Project not found'}
    }
    if(!project.outlines || project.outlines.length === 0) {
        return {status: 400, error: 'Project does not have any outlines'}
    }
    const layouts  = await generateLayoutsJson(JSON.stringify(project.outlines))

    if(layouts.status !== 200){
        return layouts
    }
    await client.project.update({
        where: {
            id: project.id
        },
        data: {
              slides: layouts.data, themeName: theme
        }
    })
    return {status: 200, data: layouts.data}
  } catch (error) {
    console.error("Error generating presentation from Google GenAI:", error);
    // Return a generic error to the client for security.
    return { status: 500, message: "An internal server error occurred." };
  }
};
