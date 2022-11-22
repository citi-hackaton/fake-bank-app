import { Prisma } from "@prisma/client";

export const userWithTransactionsSelect = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    name: true,
    balance: true,
    transaction: true,
  },
});

export type UserDetails = Prisma.UserGetPayload<typeof userWithTransactionsSelect>;
