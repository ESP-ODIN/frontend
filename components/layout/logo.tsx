import Image from "next/image"

interface LogoProps {
  showName?: boolean
}

export function Logo({ showName = true }: LogoProps) {
  return (
    <div className="flex items-center">
      <Image
        src="/_assets/Odin.png"
        alt="Odin"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      {showName && (
        <span className="ml-2 font-logo text-lg font-bold tracking-tight uppercase">Odin</span>
      )}
    </div>
  )
}
