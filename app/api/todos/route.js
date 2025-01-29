import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json(todos, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const todo = await prisma.todo.create({
      data: {
        description: body.description,
      },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const todo = await prisma.todo.delete({
      where: {
        id: body.id,
      },
    });
    return NextResponse.json(todo, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const todo = await prisma.todo.update({
      where: {
        id: body.id,
      },
      data: {
        description: body.description,
      },
    });
    return NextResponse.json(todo, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const todo = await prisma.todo.update({
      where: {
        id: body.id,
      },
      data: {
        isCompleted: body.isCompleted,
      },
    });
    return NextResponse.json(todo, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
