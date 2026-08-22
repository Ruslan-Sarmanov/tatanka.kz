import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, getDictionary, type Lang } from "./dictionaries";

export function getServerLang(): Lang {
  const value = cookies().get(LANG_COOKIE)?.value;
  return value === "kk" ? "kk" : DEFAULT_LANG;
}

export function getServerDictionary() {
  return getDictionary(getServerLang());
}
