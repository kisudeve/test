import { Database } from "@/utils/supabase/supabase";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Like = Database["public"]["Tables"]["likes"]["Row"];
export type Feel = Database["public"]["Tables"]["feels"]["Row"];
