import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma";
import { parse } from "date-fns";

export const GET = async (request: NextRequest) => {
  const authorization = request.headers.get('Authorization');
  const date = request.nextUrl.searchParams.get('date');

  const from = request.nextUrl.searchParams.get('from');
  const to = request.nextUrl.searchParams.get('to');

  if (!authorization) return NextResponse.json({ msg: 'unauthorized' }, { status: 401 });

  const [, token] = authorization.split(' ');

  if (!token) return NextResponse.json({ msg: 'unauthorized' }, { status: 401 });

  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: token
      },
      include: {
        External: {
          select: {
            name: true,
            email: true,
            phone: true,
          }
        }
      }
    });

    return NextResponse.json({ schedules }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: 'internal server error.' }, { status: 500 });
  }
}

export const POST = async (request: NextRequest) => {
  const authorization = request.headers.get('Authorization');

  if (!authorization) return NextResponse.json({ msg: 'unauthorized' }, { status: 401 });

  const [, token] = authorization.split(' ');

  if (!token) return NextResponse.json({ msg: 'unauthorized' }, { status: 401 });

  const { startTime, endTime, name, email, phone } = await request.json();

  try {
    // extract data in bearer token, to get user_id

    let external = null;

    const externalExists = await prisma.external.findUnique({
      where: { email }
    });

    if (externalExists) external = externalExists;

    if (!externalExists) {
      external = await prisma.external.create({
        data: {
          name,
          email,
          phone
        }
      });
    }

    if (!external) return NextResponse.json({ msg: 'schedule not created.' }, { status: 400 });

    await prisma.schedule.create({
      data: {
        startTime: parse(startTime, 'yyyy-MM-dd HH:mm:ss', new Date()),
        endTime: parse(endTime, 'yyyy-MM-dd HH:mm:ss', new Date()),
        userId: token,
        externalId: external.id
      }
    });

    return NextResponse.json({ msg: 'create schedule.' }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: 'internal server error.' }, { status: 500 });
  }
}