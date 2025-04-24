// app/api/get/route.ts
import { NextResponse } from 'next/server';
import { getLastResponse } from '../receive/route';

export async function GET() {
  const data = getLastResponse();
  return NextResponse.json(data);
}
