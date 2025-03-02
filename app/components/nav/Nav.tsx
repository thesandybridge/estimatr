import { createClient } from '@/utils/supabase/server'
import UserMenu from "./UserMenu";
import styles from "./styles.module.css"
import Link from 'next/link';

export default async function Nav() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data) return null

  return (
    <nav className={styles.nav}>
      {data?.user && (
        <>
          <div className={styles.primaryNav}>
            <Link href="/">
              Dashboard
            </Link>
            <Link href="/projects">
              Projects
            </Link>
          </div>
          <UserMenu user={data?.user} />
        </>
      )}
    </nav>
  )
}
