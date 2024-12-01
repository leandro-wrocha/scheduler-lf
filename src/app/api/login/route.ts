import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma";
import { compare } from "bcrypt";

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return NextResponse.json({ msg: 'email or password invalid.' }, { status: 400 });

    if (!await compare(password, user.password)) return NextResponse.json({ msg: 'email or password invalid.' }, { status: 400 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: 'internal server error.' }, { status: 500 });
  }
}