// app/api/chat/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/typeorm';
import { AiChat } from '@/entities/AiChat';

export async function POST(req: NextRequest) {
  const { message, email, uuid, sender, type } = await req.json();
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  
  const repo = AppDataSource.getRepository(AiChat);

  const chat = repo.create({
    message,
    email,
    sender,
    uuid,
    type,
    ip_address: ip.toString(),
  });

  await repo.save(chat);

  return NextResponse.json({ success: true });
}
