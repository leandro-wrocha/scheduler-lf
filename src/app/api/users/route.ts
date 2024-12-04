import { NextRequest, NextResponse } from "next/server";

import { prismaUsersRepository } from "@/database";
import { CreateUserUseCase } from "@/domain/scheduler/application/use-cases/create-user";

import { prisma } from "../prisma";

export const GET = async () => {
  const users = await prisma.user.findMany();

  return NextResponse.json({ users }, { status: 200 });
}

export const POST = async (request: NextRequest) => {
  const { firstName, lastName, email, password } = await request.json();

  const createUserUseCase = new CreateUserUseCase(prismaUsersRepository);

  try {
    await createUserUseCase.execute({ firstName, lastName, email, password });

    return NextResponse.json({ msg: 'user created.' }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: 'internal server error.' }, { status: 500 });
  }
}