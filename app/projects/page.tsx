import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import CreateProject from './components/CreateProject'
import ProjectsTable from './components/ProjectsTable'
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
      <ProjectsTable userId={data?.user.id} />
    </div>
  )
}
