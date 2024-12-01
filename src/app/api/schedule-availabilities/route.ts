import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma";

export const GET = async (request: NextRequest) => {
  const authorization = request.headers.get('Authorization');

  if (!authorization) return NextResponse.json({ msg: 'unauthorized' }, { status: 401 });

  const [, token] = authorization.split(' ');

  if (!token) return NextResponse.json({ msg: 'unauthorized' }, { status: 401 });

  try {
    const schedulesAvailabilities = await prisma.scheduleAvailability.findMany({
      where: {
        userId: token
      }
    });

    return NextResponse.json({ schedulesAvailabilities }, { status: 200 });
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

  const data = await request.json();

  try {
    // extract data in bearer token, to get user_id

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.$transaction(data.map((item: any) => prisma.scheduleAvailability.create({
      data: {
        day: item.day,
        vacancies: item.vacancies,
        startTime: item.startTime,
        endTime: item.endTime,
        userId: token
      }
    })));

    return NextResponse.json({ msg: 'create schedule.' }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: 'internal server error.' }, { status: 500 });
  }
}