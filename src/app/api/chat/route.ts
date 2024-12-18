import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI API key
});

// Predefined medical scenarios
const scenarios: Record<string, { intro: string; diagnosis: string }> = {
  hypertension: {
    intro: 'A 50-year-old male presents with hypertension and fatigue.',
    diagnosis: 'Hypertension',
  },
  dengue: {
    intro: 'A 45-year-old man presents with fever, rash, and body aches.',
    diagnosis: 'Dengue Fever',
  },
  construction_injury: {
    intro: 'A 35-year-old construction worker diagnosed with a broken leg after a workplace fall.',
    diagnosis: 'Workplace Injury',
  },
  influenza: {
    intro: 'A 22-year-old college student presents with fever and cough.',
    diagnosis: 'Influenza',
  },
};

export async function POST(req: NextRequest) {
  try {
    const { scenario, question } = await req.json();

    if (!scenarios[scenario]) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    const patientInfo = scenarios[scenario];
    const prompt = `Scenario: ${patientInfo.intro}\nDoctor: ${question}\nPatient:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a patient responding to questions about symptoms. If the user correctly diagnoses your condition, confirm it.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
    });

    return NextResponse.json({
      response: response.choices[0]?.message?.content?.trim() || 'No response from the model.',
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json({ error: 'Failed to process your request.' }, { status: 500 });
  }
}
