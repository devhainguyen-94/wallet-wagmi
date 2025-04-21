import { execa } from 'execa'
import dotenv from 'dotenv'

dotenv.config()

async function initDB() {
  try {
    console.log('⚙️  Running prisma generate...')
    await execa('npx', ['prisma', 'generate'], { stdio: 'inherit' })

    console.log('🧱 Running prisma migrate...')
    await execa('npx', ['prisma', 'migrate', 'dev', '--name', 'init'], { stdio: 'inherit' })

    console.log('✅ Database ready!')
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    process.exit(1)
  }
}

initDB()
