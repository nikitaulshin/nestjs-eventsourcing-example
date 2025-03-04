import { Prisma } from '@prisma/client';

export const dealEventModel = Prisma.validator<Prisma.DealEventDefaultArgs>()({
  select: {
    id: true,
    dealId: true,
    type: true,
    payload: true,
    createdAt: true,
  },
});

export type DealEvent = Prisma.DealEventGetPayload<typeof dealEventModel>;