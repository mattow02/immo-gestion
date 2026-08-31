import Image from "next/image"
import { Building2 } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 border border-white/30 rounded-3xl rotate-12" />
          <div className="absolute top-40 right-20 w-48 h-48 border border-white/20 rounded-2xl -rotate-6" />
          <div className="absolute bottom-32 left-1/4 w-72 h-72 border border-white/25 rounded-3xl rotate-3" />
          <div className="absolute bottom-20 right-10 w-40 h-40 border border-white/15 rounded-xl rotate-45" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            <span className="text-2xl font-bold">Immo-Gestion</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Gerez vos biens<br />en toute simplicite
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-md">
              Suivi des loyers, gestion des locataires, documents et quittances — tout au meme endroit.
            </p>
          </div>
          <p className="text-sm text-primary-foreground/40">
            Plateforme de gestion locative
          </p>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center px-4">
        <Image
          src="/auth-bg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
