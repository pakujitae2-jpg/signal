import Link from "next/link";
import { LANGS, LANG_LABEL, prefix, type Lang } from "@/lib/i18n";

/** en/ko/ja links for the same page, used in every localized page header. */
export function LangSwitch({ lang, path }: { lang: Lang; path: string }) {
  return (
    <span className="subhead-note">
      {LANGS.map((l, i) => (
        <span key={l}>
          {i > 0 && " · "}
          {l === lang ? (
            <b>{LANG_LABEL[l]}</b>
          ) : (
            <Link className="crumb" href={`${prefix(l)}${path}`} hrefLang={l}>
              {LANG_LABEL[l]}
            </Link>
          )}
        </span>
      ))}
    </span>
  );
}

/** Page header: home crumb (plus an optional second crumb) and the language switcher. */
export default function LangNav({
  lang,
  path,
  crumb,
}: {
  lang: Lang;
  path: string;
  crumb?: { href: string; label: string };
}) {
  const p = prefix(lang);
  return (
    <header className="subhead">
      <span>
        <Link className="crumb" href={`${p}/`}>
          ← PNL404
        </Link>
        {crumb && (
          <>
            {" · "}
            <Link className="crumb" href={crumb.href}>
              {crumb.label}
            </Link>
          </>
        )}
      </span>
      <LangSwitch lang={lang} path={path} />
    </header>
  );
}
