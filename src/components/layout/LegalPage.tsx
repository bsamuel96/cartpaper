import Link from "next/link";

type LegalPageProps = {
  page: {
    title: string;
    updated: string;
    sections: Array<{ title: string; body: string }>;
  };
};

export function LegalPage({ page }: LegalPageProps) {
  return (
    <article className="legalPage">
      <Link className="backLink" href="/">
        Înapoi acasă
      </Link>
      <p className="overline">{page.updated}</p>
      <h1>{page.title}</h1>
      <div className="legalSections">
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
