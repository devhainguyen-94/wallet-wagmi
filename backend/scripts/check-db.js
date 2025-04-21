import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Kết nối database thành công!')
  } catch (error) {
    console.error('❌ Kết nối database thất bại:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkConnection()
