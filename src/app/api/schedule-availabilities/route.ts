import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prisma";
import { differenceInMinutes, eachMinuteOfInterval, endOfDay, format, isEqual, parse, startOfDay } from "date-fns";

const days = ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'];

export const GET = async (request: NextRequest) => {
  const authorization = request.headers.get('Authorization');
  const date = request.nextUrl.searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');

  if (!authorization) return NextResponse.json({ msg: 'unauthorized' }, { status: 401 });

  const [, token] = authorization.split(' ');

  if (!token) return NextResponse.json({ msg: 'unauthorized' }, { status: 401 });

  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: token,
        startTime: {
          gte: startOfDay(parse(date, 'yyyy-MM-dd', new Date())),
          lte: endOfDay(parse(date, 'yyyy-MM-dd', new Date()))
        }
      }
    });

    const schedulesAvailabilities = await prisma.scheduleAvailability.findMany({
      where: {
        userId: token,
        day: days[parse(date, 'yyyy-MM-dd', new Date()).getDay()]
      }
    });

    let hoursAvailables: any[] = [];

    schedulesAvailabilities.forEach(schedulesAvailabilities => {
      const startTime = parse(schedulesAvailabilities.startTime, 'HH:mm', parse(date, 'yyyy-MM-dd', new Date()));
      const endTime = parse(schedulesAvailabilities.endTime, 'HH:mm', parse(date, 'yyyy-MM-dd', new Date()));
  
      const difference = differenceInMinutes(endTime, startTime);
      const minutesByVacancies = difference / schedulesAvailabilities.vacancies;
      
      hoursAvailables = hoursAvailables.concat(
        eachMinuteOfInterval({
          start: startTime,
          end: endTime,
        }, { step: minutesByVacancies })
      )
    });

    hoursAvailables = hoursAvailables.filter(hour => !schedules.find(schedule => isEqual(schedule.startTime, hour)));
    hoursAvailables = hoursAvailables.sort((a: Date, b: Date) => a.getTime() - b.getTime());

    return NextResponse.json({ hoursAvailables }, { status: 200 });
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