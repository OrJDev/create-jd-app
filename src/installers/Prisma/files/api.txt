import { prisma } from "~/server/db/client";
import { json, type APIEvent } from "solid-start";

export async function GET() {
  return json(await prisma.notes.findMany());
}

export async function POST(event: APIEvent) {
  const { text } = await event.request.json();
  return json(
    await prisma.notes.create({
      data: {
        text,
      },
    })
  );
}
