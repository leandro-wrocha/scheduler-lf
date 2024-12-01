import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";

export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { firstName, lastName, email, password } = await request.json();

  try {
    if (!id) return NextResponse.json({ msg: 'id not defined.' }, { status: 400 });

    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) return NextResponse.json({ msg: 'user not exists.' }, { status: 400 });

    await prisma.user.update({
      where: { id },
      data: { firstName, lastName, email, password }
    });

    return NextResponse.json({ msg: 'user data updated.' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: 'internal server error.' }, { status: 500 });
  }
}

export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  if (!id) return NextResponse.json({ msg: 'user not found.' }, { status: 400 });

  try {
    const userExists = await prisma.user.findUnique({ where: { id } });

    if (!userExists) return NextResponse.json({ msg: 'user not found.'}, { status: 400 });

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ msg: 'empty.' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: 'internal server error.' }, { status: 500 });
  }
}
