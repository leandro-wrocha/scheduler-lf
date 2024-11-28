import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma"

export const GET = async () => {
  const users = await prisma.user.findMany();

  return NextResponse.json({ users }, { status: 200 });
}

export const POST = async (request: NextRequest) => {
  const body: any = await request.json();

  await prisma.user.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    }
  });

  return NextResponse.json({ msg: 'user created' }, { status: 201 });
}