import { githubLogin, googleLogin, discordLogin } from '@/utils/actions/index'
import { ChevronRight } from 'lucide-react'


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Google" {...props}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 3l5.7-5.7C33.8 6 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 18-8.1 18-18c0-1.2-.1-2.1-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 16.5 18.8 12 24 12c3 0 5.7 1.1 7.7 3l5.7-5.7C33.8 6 29.2 4 24 4 15.5 4 8.3 8.8 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.8-2 13.1-5.2l-6-4.9C29.3 36.6 26.8 38 24 38c-5.2 0-9.6-3.6-11.3-8.5l-6.5 5C8.3 39.2 15.5 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.6 5.6-6.9 6.8l6 4.9C37.8 37.8 42 32.6 42 26c0-1.9-.2-3.4-.4-5.5z"/>
    </svg>
  )
}
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="GitHub" {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.07 3.29 9.36 7.86 10.88.58.1.79-.26.79-.57v-2.02c-3.2.7-3.87-1.36-3.87-1.36-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.76.4-1.27.72-1.56-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.42-2.68 5.39-5.24 5.68.42.36.77 1.07.77 2.16v3.2c0 .31.2.68.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/>
    </svg>
  )
}
function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 199" role="img" aria-label="Discord" {...props}>
      <path
        fill="currentColor"
        d="M216.856 16.596A208.53 208.53 0 0 0 170.04 4.37a144.09 144.09 0 0 0-6.72 13.94 199.74 199.74 0 0 0-59.717 0 144.16 144.16 0 0 0-6.72-13.94 208.692 208.692 0 0 0-46.84 12.226C18.487 53.404 9.38 89.27 12.467 124.73c19.64 14.66 38.63 23.61 57.25 29.55a161.77 161.77 0 0 0 12.41-19.62c-6.84-2.61-13.33-5.84-19.42-9.64 1.62-1.2 3.21-2.45 4.76-3.74 36.94 17.32 77.02 17.32 113.63 0 1.56 1.29 3.15 2.54 4.77 3.74-6.11 3.8-12.61 7.03-19.46 9.65a161.42 161.42 0 0 0 12.48 19.67c18.62-5.94 37.6-14.89 57.24-29.55 4.7-52.19-8.08-87.76-35.25-108.14ZM95.95 115.69c-10.99 0-19.95-9.99-19.95-22.31 0-12.33 8.86-22.32 19.95-22.32 11.1 0 20.06 10 19.95 22.32 0 12.32-8.86 22.31-19.95 22.31Zm63.98 0c-10.99 0-19.95-9.99-19.95-22.31 0-12.33 8.86-22.32 19.95-22.32 11.1 0 20.06 10 19.95 22.32 0 12.32-8.85 22.31-19.95 22.31Z"
      />
    </svg>
  )
}


const BTN =
  'relative w-full h-12 flex items-center justify-center gap-3 px-6 rounded-full ' +
  'border border-gray-300 hover:border-gray-400 bg-white text-sm shadow ' +
  'transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function SignInPage() {
  return (
   
    <main className= "min-h-screen flex justify-center pt-64 bg-white">
     
      <div className="w-[520px] text-center">
        <h1 className="text-[44px] leading-tight font-extrabold tracking-tight mb-8">
          Welcome Back
        </h1>

        <div className="space-y-4">
          <form action={googleLogin} aria-label="Sign in with Google">
            <button className={BTN}>
              <span className="flex items-center gap-3">
                <GoogleIcon className="size-5" />
                <span className="font-medium">Sign in with Google</span>
              </span>
              <ChevronRight className="size-4 opacity-60 absolute right-4" aria-hidden />
            </button>
          </form>

          <form action={githubLogin} aria-label="Sign in with GitHub">
            <button className={BTN}>
              <span className="flex items-center gap-3">
                <GithubIcon className="size-5 text-gray-900" />
                <span className="font-medium">Sign in with GitHub</span>
              </span>
              <ChevronRight className="size-4 opacity-60 absolute right-4" aria-hidden />
            </button>
          </form>

          <form action={discordLogin} aria-label="Sign in with Discord">
            <button className={BTN}>
              <span className="flex items-center gap-3">
                <DiscordIcon className="size-5 text-[#5865F2]" />
                <span className="font-medium">Sign in with Discord</span>
              </span>
              <ChevronRight className="size-4 opacity-60 absolute right-4" aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
