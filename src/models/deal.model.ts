import { Prisma } from '@prisma/client';

export const dealModel = Prisma.validator<Prisma.DealDefaultArgs>()({
    select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
    },
});

export type Deal = Prisma.DealGetPayload<typeof dealModel>;