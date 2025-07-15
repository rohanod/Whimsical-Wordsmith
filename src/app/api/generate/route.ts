import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Prompt and type are required' },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: google('gemini-2.0-flash-lite'),
      prompt,
      maxTokens: 150,
      temperature: 0.8,
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error generating text:', error);
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    );
  }
}