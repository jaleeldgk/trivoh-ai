import { NextResponse } from 'next/server';

let lastResponse: { chatResponse?: string; htmlResponse?: string } = {};

export async function POST(request: Request) {
  const data = await request.json();

  console.log("Received from n8n:", data);

  lastResponse = {
    chatResponse: data.chatResponse || '',
    htmlResponse: data.htmlResponse || '',
  };

  return NextResponse.json({ success: true });
}

export function getLastResponse() {
  return lastResponse;
}
