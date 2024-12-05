import {
  Event,
  CandidateTime,
  PrismaClient,
  User,
  attendance,
} from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  const users: User[] = await prisma.user.createManyAndReturn({
    data: [
      { id: 1, name: '田中 太郎' },
      { id: 2, name: '鈴木 花子' },
      { id: 3, name: '佐藤 一郎' },
      { id: 4, name: '高橋 美咲' },
    ],
    skipDuplicates: true,
  });

  const events: Event[] = await prisma.event.createManyAndReturn({
    data: [
      {
        id: 1,
        title: 'イベントA',
        deadline: new Date('2099-12-31'),
        detail: 'イベントA情報',
        userId: users[0].id,
      },
      {
        id: 2,
        title: 'イベントB',
        deadline: new Date('2099-01-01'),
        detail: 'イベントB情報',
        userId: users[1].id,
      },
    ],
    skipDuplicates: true,
  });

  const candidateTimes: CandidateTime[] =
    await prisma.candidateTime.createManyAndReturn({
      data: [
        {
          id: 1,
          startTime: new Date('2024-09-01 13:00:00'),
          eventId: events[0].id,
        },
        {
          id: 2,
          startTime: new Date('2024-09-01 14:00:00'),
          eventId: events[0].id,
        },
        {
          id: 3,
          startTime: new Date('2024-09-01 15:00:00'),
          eventId: events[0].id,
        },
        {
          id: 4,
          startTime: new Date('2024-09-02 13:00:00'),
          eventId: events[0].id,
        },
        {
          id: 5,
          startTime: new Date('2024-09-02 14:00:00'),
          eventId: events[0].id,
        },
        {
          id: 6,
          startTime: new Date('2024-09-02 15:00:00'),
          eventId: events[0].id,
        },
        {
          id: 7,
          startTime: new Date('2024-10-01 13:00:00'),
          eventId: events[1].id,
        },
        {
          id: 8,
          startTime: new Date('2024-10-01 14:00:00'),
          eventId: events[1].id,
        },
        {
          id: 9,
          startTime: new Date('2024-10-01 15:00:00'),
          eventId: events[1].id,
        },
        {
          id: 10,
          startTime: new Date('2024-10-02 13:00:00'),
          eventId: events[1].id,
        },
        {
          id: 11,
          startTime: new Date('2024-10-02 14:00:00'),
          eventId: events[1].id,
        },
        {
          id: 12,
          startTime: new Date('2024-10-02 15:00:00'),
          eventId: events[1].id,
        },
      ],
      skipDuplicates: true,
    });

  const attendances: attendance[] = await prisma.attendance.createManyAndReturn(
    {
      data: [
        {
          id: 1,
          status: 'ok',
          candidateTimeId: candidateTimes[0].id,
          userId: users[0].id,
        },
        {
          id: 2,
          status: 'ok',
          candidateTimeId: candidateTimes[0].id,
          userId: users[1].id,
        },
        {
          id: 3,
          status: 'ok',
          candidateTimeId: candidateTimes[0].id,
          userId: users[2].id,
        },
        {
          id: 4,
          status: 'ng',
          candidateTimeId: candidateTimes[0].id,
          userId: users[3].id,
        },
        {
          id: 5,
          status: 'ok',
          candidateTimeId: candidateTimes[1].id,
          userId: users[0].id,
        },
        {
          id: 6,
          status: 'ok',
          candidateTimeId: candidateTimes[1].id,
          userId: users[1].id,
        },
        {
          id: 7,
          status: 'pending',
          candidateTimeId: candidateTimes[1].id,
          userId: users[2].id,
        },
      ],
    },
  );
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
