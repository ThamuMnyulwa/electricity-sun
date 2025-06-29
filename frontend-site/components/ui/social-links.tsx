import { cn } from "@/lib/utils"

export type SocialPlatform = "twitter" | "facebook" | "instagram" | "linkedin" | "youtube" | "github"

const SOCIAL_ICONS: Record<SocialPlatform, string> = {
  twitter:
    "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  instagram:
    "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9a5.5 5.5 0 0 1 5.5 5.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z",
  linkedin:
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  youtube:
    "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
  github:
    "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
}

export interface SocialLink {
  platform: SocialPlatform
  url: string
}

interface SocialLinksProps {
  links: SocialLink[]
  className?: string
  iconClassName?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
  showLabels?: boolean
}

export function SocialLinks({
  links,
  className,
  iconClassName,
  size = "md",
  variant = "default",
  showLabels = false,
}: SocialLinksProps) {
  // Size mappings
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  // Variant mappings
  const variantClasses = {
    default: "bg-forest-800 text-forest-300 hover:bg-forest-700 hover:text-white",
    outline: "bg-transparent border border-forest-600 text-forest-600 hover:bg-forest-50",
    ghost: "bg-transparent text-forest-600 hover:bg-forest-50",
  }

  return (
    <div className={cn("flex gap-4", className)}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "rounded-full flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2",
            sizeClasses[size],
            variantClasses[variant],
            iconClassName,
          )}
          aria-label={`Visit our ${link.platform} page`}
        >
          <span className="sr-only">{link.platform}</span>
          <svg
            width={iconSizes[size]}
            height={iconSizes[size]}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d={SOCIAL_ICONS[link.platform]} />
          </svg>

          {showLabels && <span className="ml-2 text-sm font-medium capitalize">{link.platform}</span>}
        </a>
      ))}
    </div>
  )
}
