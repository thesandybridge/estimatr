import { createClient } from '@/utils/supabase/server'
import UserMenu from "./UserMenu";
import styles from "./styles.module.css"
import Link from 'next/link';

export default async function Nav() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null

  return (
    <nav className={styles.nav}>
      {data?.user && (
        <>
          <Link href="/projects">
            Projects
          </Link>
          <UserMenu user={data?.user} />
        </>
      )}
    </nav>
  )
}
