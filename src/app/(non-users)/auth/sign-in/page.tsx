import { githubLogin } from "@/utils/actions/index";

export default function Page() {
  return (
    <>
      <div className="max-w-md mx-auto mt-16">
        <form action={githubLogin}>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 transition-all text-sm">
            Continue with GitHub
          </button>
        </form>
      </div>
    </>
  );
}
