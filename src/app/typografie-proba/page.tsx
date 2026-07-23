export const metadata = {
  title: "Probă tipografie — Cartpaper",
};

export default function TypographyProofPage() {
  return (
    <section className="typographyProof" aria-labelledby="typography-proof-title">
      <p className="overline">PROBĂ TIPOGRAFIE</p>
      <h1 id="typography-proof-title">Ă Â Î Ș Ț</h1>
      <p>ă â î ș ț</p>
      <h2>Pungi de hârtie personalizate</h2>
      <h3>Brandul tău, ambalat frumos.</h3>
      <p>Soluționarea Alternativă a Litigiilor</p>
      <label className="field">
        <span>Text introdus</span>
        <input defaultValue="Și Ț cu virgulă" />
      </label>
    </section>
  );
}
