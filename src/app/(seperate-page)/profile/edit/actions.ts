'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../../../utils/supabase/server';

export type ActionResult = { ok: boolean; message: string; url?: string };

export async function uploadAvatar(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { ok: false, message: '로그인이 필요합니다.' };
    }

    const userId = String(formData.get('userId') ?? user.id);
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
      return { ok: false, message: '파일이 없습니다.' };
    }

    const filePath = `user-${userId}/${Date.now()}-${file.name}`;

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: file.type,
      });

    if (upErr) {
      return { ok: false, message: `업로드 실패: ${upErr.message}` };
    }

    const { data: pub } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    const publicUrl = pub?.publicUrl ?? '';

    const { error: upUserErr } = await supabase
      .from('users')
      .update({ image_url: publicUrl })
      .eq('id', userId);

    if (upUserErr) {
      return { ok: false, message: `프로필 갱신 실패: ${upUserErr.message}` };
    }

    revalidatePath('/profile');
    revalidatePath(`/profile/${userId}`);

    return { ok: true, message: '업로드 성공', url: publicUrl };
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : typeof e === 'string'
          ? e
          : '알 수 없는 오류';
    return { ok: false, message };
  }
}

export async function resetAvatar(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { ok: false, message: '로그인이 필요합니다.' };
    }

    const userId = String(formData.get('userId') ?? user.id);

    const { error: upErr } = await supabase
      .from('users')
      .update({ image_url: null })
      .eq('id', userId);

    if (upErr) {
      return { ok: false, message: `초기화 실패: ${upErr.message}` };
    }

    revalidatePath('/profile');
    revalidatePath(`/profile/${userId}`);

    return { ok: true, message: '기본 이미지로 되돌렸습니다.' };
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : typeof e === 'string'
          ? e
          : '알 수 없는 오류';
    return { ok: false, message };
  }
}

export async function saveProfile(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { ok: false, message: '로그인이 필요합니다.' };
    }

    const userId = String(formData.get('userId') ?? user.id);
    const display_name = String(formData.get('display_name') ?? '').trim();
    const bio = String(formData.get('bio') ?? '').trim();

    const { error: upErr } = await supabase
      .from('users')
      .update({ display_name, bio })
      .eq('id', userId);

    if (upErr) {
      return { ok: false, message: `프로필 저장 실패: ${upErr.message}` };
    }

    return { ok: true, message: '프로필이 저장되었습니다.' };
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : typeof e === 'string'
          ? e
          : '알 수 없는 오류';
    return { ok: false, message };
  }
}
