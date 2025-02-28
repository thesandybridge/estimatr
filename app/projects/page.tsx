import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import CreateProject from './components/CreateProject'
import Projects from './components/Projects'
import styles from './styles.module.css'


export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className={styles.container}>
      <CreateProject owner={data?.user.id} />
      <Projects userId={data?.user.id} />
    </div>
  )
}
