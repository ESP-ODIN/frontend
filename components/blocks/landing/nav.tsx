import { Logo } from '@/components/blocks/logo'
import { SearchBar } from '@/components/blocks/search-bar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Nav() {
  return (
    <div className="flex items-center justify-evenly p-4">
        <Logo  />
        <SearchBar count={100} />
        <div>
            <Button className= "text-foreground" variant="link" size="sm">
                <Link href="/sign-in">
                    Sign In
                </Link>
            </Button>
            <Button className= "rounded-lg" variant="default" size="sm">
                <Link href="/log-in">
                    Log In
                </Link>
            </Button>
        </div>
    </div>

  )
}
