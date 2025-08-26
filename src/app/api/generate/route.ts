import { createGoogleGenerativeAI, google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { EnableLogging } from '../../config';

// Universal text generation with JSON parsing
async function generateStructuredFromText(
  prompt: string,
  schemaDescription: string,
  exampleFormat: string,
  temperature: number = 0.3,
  apiKey?: string
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

        if (EnableLogging) {
      console.log('Generating with schema description:', schemaDescription);
      // Write debug info to file
      await writeDebugLog(fullPrompt, 'Generating...', schemaDescription);
    }

    // Create model with user-provided API key using proper SDK configuration
    let model;
    if (apiKey) {
      // Use custom Google AI provider with user-provided API key
      const customGoogle = createGoogleGenerativeAI({
        apiKey,
      });
      model = customGoogle('gemini-2.5-flash');
    } else {
      // Use default provider (falls back to environment variable)
      model = google('gemini-2.5-flash');
    }

    const result = await generateText({
      model,
      prompt: fullPrompt,
      temperature,
    });
    
    if (EnableLogging) {
      console.log('Raw AI response text:', result.text);
    }

    // Clean the response - remove any markdown formatting
    let cleanedResponse = result.text.trim();

    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
    }

    if (EnableLogging) {
      console.log('Cleaned response:', cleanedResponse);
    }

    // Parse JSON
    let parsedObject;
    try {
      parsedObject = JSON.parse(cleanedResponse);
      if (EnableLogging) {
        console.log('Successfully parsed JSON:', parsedObject);
        // Write successful response to debug log
        await writeDebugLog(fullPrompt, JSON.stringify(parsedObject, null, 2), schemaDescription);
        console.log('Final parsed object:', parsedObject);
      }
    } catch (parseError) {
      if (EnableLogging) {
        console.error('Failed to parse JSON:', parseError);
      }
      throw new Error(`Invalid JSON response: ${cleanedResponse}`);
    }
    return parsedObject;
  } catch (error) {
    if (EnableLogging) {
      console.error('Error in generateStructuredFromText:', error);
      // Write error to debug log
      await writeDebugLog(prompt, `ERROR: ${error instanceof Error ? error.message : String(error)}`, schemaDescription);
    }

    throw error;
  }
}

// Helper function to write debug logs
async function writeDebugLog(userPrompt: string, aiResponse: string, schemaDescription: string): Promise<void> {
  if (!EnableLogging) return;

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
    const { prompt, schemaDescription, exampleFormat, temperature = 0.3, apiKey } = await request.json();

    if (!prompt || !schemaDescription || !exampleFormat) {
      return NextResponse.json(
        { error: 'Prompt, schemaDescription, and exampleFormat are required' },
        { status: 400 }
      );
    }

    // Check if API key is provided when UserGivesKey is true
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    const result = await generateStructuredFromText(prompt, schemaDescription, exampleFormat, temperature, apiKey);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating structured output:', error);
    return NextResponse.json(
      { error: 'Failed to generate structured output' },
      { status: 500 }
    );
  }
}