import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma";
import { hash } from "bcrypt";
import { z } from 'zod';


const schemaUserCreateRequest = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type UserCreateRequest = z.infer<typeof schemaUserCreateRequest>;


export const GET = async () => {
  const users = await prisma.user.findMany();

  return NextResponse.json({ users }, { status: 200 });
}

export const POST = async (request: NextRequest) => {
  const { firstName, lastName, email, password }: UserCreateRequest = await request.json();

  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) return NextResponse.json({ msg: 'user already exists.' }, { status: 400 });

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: await hash(password, 12),
      }
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: 'internal server error.' }, { status: 500 });
  }

  return NextResponse.json({ msg: 'user created' }, { status: 201 });
}