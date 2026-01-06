import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@dirasa.com' },
    update: {},
    create: {
      email: 'admin@dirasa.com',
      password: hashedPassword,
      name: 'Admin Dirasa',
      role: 'ADMIN',
    },
  });

  await prisma.category.createMany({
    data: [{ name: 'Makanan' }, { name: 'Minuman' }],
    skipDuplicates: true,
  });

  console.log('Seeding berhasil dilakukan!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());