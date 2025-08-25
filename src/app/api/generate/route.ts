import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

// Global model configuration
const MODEL = google('gemini-2.5-flash');

// Universal text generation with JSON parsing
async function generateStructuredFromText(
  prompt: string,
  schemaDescription: string,
  exampleFormat: string,
  temperature: number = 0.3
): Promise<unknown> {
  try {
    const fullPrompt = `You are a JSON response generator. You MUST respond with ONLY a valid JSON object that matches the required schema exactly. Do not include any explanation, markdown formatting, or additional text - just the raw JSON object.

REQUIRED JSON SCHEMA:
${schemaDescription}

EXAMPLE FORMAT:
${exampleFormat}

USER REQUEST:
${prompt}

IMPORTANT: Your response must be ONLY the JSON object, nothing else. No markdown code blocks, no explanations, no additional text.`;

    console.log('Generating with schema description:', schemaDescription);
    
    // Write debug info to file
    await writeDebugLog(fullPrompt, 'Generating...', schemaDescription);
    
    const result = await generateText({
      model: MODEL,
      prompt: fullPrompt,
      temperature,
    });
    
    console.log('Raw AI response text:', result.text);
    
    // Clean the response - remove any markdown formatting
    let cleanedResponse = result.text.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    console.log('Cleaned response:', cleanedResponse);
    
    // Parse JSON
    let parsedObject;
    try {
      parsedObject = JSON.parse(cleanedResponse);
      console.log('Successfully parsed JSON:', parsedObject);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      throw new Error(`Invalid JSON response: ${cleanedResponse}`);
    }
    
    // Write successful response to debug log
    await writeDebugLog(fullPrompt, JSON.stringify(parsedObject, null, 2), schemaDescription);
    
    console.log('Final parsed object:', parsedObject);
    return parsedObject;
  } catch (error) {
    console.error('Error in generateStructuredFromText:', error);
    
    // Write error to debug log
    await writeDebugLog(prompt, `ERROR: ${error instanceof Error ? error.message : String(error)}`, schemaDescription);
    
    throw error;
  }
}

// Helper function to write debug logs
async function writeDebugLog(userPrompt: string, aiResponse: string, schemaDescription: string): Promise<void> {
  try {
    const logContent = `=== DEBUG LOG ===
TIMESTAMP: ${new Date().toISOString()}
SCHEMA: ${schemaDescription}

USER PROMPT:
${userPrompt}

AI RESPONSE:
${aiResponse}

=================
`;
    
    const logPath = path.join(process.cwd(), 'debugPrompt.log');
    await writeFile(logPath, logContent, 'utf8');
  } catch (error) {
    console.error('Failed to write debug log:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, schemaDescription, exampleFormat, temperature = 0.3 } = await request.json();

    if (!prompt || !schemaDescription || !exampleFormat) {
      return NextResponse.json(
        { error: 'Prompt, schemaDescription, and exampleFormat are required' },
        { status: 400 }
      );
    }

    const result = await generateStructuredFromText(prompt, schemaDescription, exampleFormat, temperature);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating structured output:', error);
    return NextResponse.json(
      { error: 'Failed to generate structured output' },
      { status: 500 }
    );
  }
}