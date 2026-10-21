import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'DeepSeek AI Orbital Copilot Engine',
    model: 'deepseek-chat',
    provider: 'DeepSeek API',
    endpoints: {
      official: 'https://api.deepseek.com/chat/completions',
      models: ['deepseek-chat', 'deepseek-reasoner']
    },
    capabilities: [
      'Real-Time Orbital Telemetry Synthesis',
      'Keplerian Free-Fall Physics Analysis',
      'Expedition 72 Microgravity Science Briefings',
      'ARISS Amateur Radio Doppler Shift Computations'
    ]
  });
}
