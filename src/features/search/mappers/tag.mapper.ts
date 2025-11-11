import type { DBTagRow } from "../types/db";
import type { SearchTag } from "@/components/search/types";

export const mapRowToSearchTag = (r: DBTagRow): SearchTag => ({ content: r.content });
