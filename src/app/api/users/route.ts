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

  const response = await createUserUseCase.execute({ firstName, lastName, email, password });

  if (response.isLeft()) {
    return NextResponse.json({ msg: response.value.message }, { status: 400 });
  }

  return NextResponse.json({}, { status: 201 });
}