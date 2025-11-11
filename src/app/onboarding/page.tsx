import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'



export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  async function save(formData: FormData) {
    'use server'
    const supabase = await createClient()

    const display_name = String(formData.get('display_name') ?? '').trim()
    const bio = String(formData.get('bio') ?? '').trim()
    if (!display_name || !bio) {
      throw new Error('닉네임과 자기소개를 모두 입력해주세요.')
    }


    await supabase
      .from('users')
      .update({ display_name, bio })
      .eq('id', user!.id)

    redirect(`/profile/${user!.id}`)
  }

  return (
    <form action={save} className="max-w-md mx-auto pt-16 space-y-4">
      <h1 className="text-2xl font-bold">프로필 설정</h1>

      <label className="block">
        <span className="mb-1 block text-sm text-gray-600">닉네임</span>
        <input
          name="display_name"
          maxLength={20}
          required
          className="w-full h-10 rounded border px-3"
          placeholder="닉네임을 적어주세요"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-gray-600">자기소개</span>
        <textarea
          name="bio"
          rows={4}
          required
          className="w-full rounded border px-3 py-2"
          placeholder="간단한 소개를 적어주세요"
        />
      </label>

      <button className="h-10 rounded bg-black px-4 text-white">저장</button>
    </form>
  )
}
