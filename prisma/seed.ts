import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, TransactionType } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
    },
  });

  const [salaryCategory, freelanceCategory, foodCategory, transportCategory] =
    await Promise.all([
      prisma.category.create({
        data: {
          name: 'Salary',
          type: TransactionType.INCOME,
          userId: user.id,
        },
      }),

      prisma.category.create({
        data: {
          name: 'Freelance',
          type: TransactionType.INCOME,
          userId: user.id,
        },
      }),

      prisma.category.create({
        data: {
          name: 'Food',
          type: TransactionType.EXPENSE,
          userId: user.id,
        },
      }),

      prisma.category.create({
        data: {
          name: 'Transportation',
          type: TransactionType.EXPENSE,
          userId: user.id,
        },
      }),
    ]);

  await prisma.transaction.createMany({
    data: [
      {
        title: 'Monthly Salary',
        amount: 10_000_000,
        date: new Date('2026-06-01'),
        userId: user.id,
        categoryId: salaryCategory.id,
      },

      {
        title: 'Website Project',
        amount: 2_500_000,
        date: new Date('2026-06-05'),
        userId: user.id,
        categoryId: freelanceCategory.id,
      },

      {
        title: 'Lunch',
        amount: 50_000,
        description: 'Lunch with friends',
        date: new Date('2026-06-07'),
        userId: user.id,
        categoryId: foodCategory.id,
      },

      {
        title: 'Gasoline',
        amount: 100_000,
        description: 'Motorcycle fuel',
        date: new Date('2026-06-08'),
        userId: user.id,
        categoryId: transportCategory.id,
      },

      {
        title: 'Dinner',
        amount: 75_000,
        description: 'Family dinner',
        date: new Date('2026-06-10'),
        userId: user.id,
        categoryId: foodCategory.id,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });