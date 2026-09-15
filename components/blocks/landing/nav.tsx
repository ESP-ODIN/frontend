import { Logo } from '@/components/blocks/logo'
import { SearchBar } from '@/components/blocks/search-bar'
import { CommandMenu } from '@/components/blocks/command-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Nav() {
  return (
    <>
      <div className="flex items-center justify-between gap-4 pb-4">
          <div className="flex flex-1 items-center">
              <Logo  />
          </div>
          <SearchBar count={100} className="max-w-md" />
          <div className="flex flex-1 items-center justify-end">
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
      <CommandMenu />
    </>
  )
}
