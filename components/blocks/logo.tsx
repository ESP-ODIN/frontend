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
      />
      {showName && <span className="ml-2 font-bold uppercase">Odin</span>}
    </div>
  )
}
