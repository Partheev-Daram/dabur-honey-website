import ConsentControls from '../components/info/ConsentControls.jsx';

const Block = ({ title, children }) => (
  <section className="card p-5 md:p-6">
    <h2 className="section-title">{title}</h2>
    <div className="mt-3 text-ink-soft leading-relaxed grid gap-2">{children}</div>
  </section>
);

export default function Privacy() {
  return (
    <div className="container-x py-8 md:py-12 max-w-3xl">
      <h1 className="h-display text-4xl md:text-5xl">Privacy &amp; Consent</h1>
      <p className="mt-3 text-ink-soft">Plain language: what we collect, what we do not, and how you stay in control. No sign-up is needed to use this site.</p>

      <div className="mt-8 grid gap-5">
        <Block title="What we collect (only if you accept)">
          <ul className="list-disc pl-5 grid gap-1">
            <li>Anonymous events such as a pack scan, a recipe view, or a shop click.</li>
            <li>Campaign and pack identifiers that come from the QR link you opened.</li>
          </ul>
          <p>Your saved recipes and cart stay on your device.</p>
        </Block>
        <Block title="What we do not collect">
          <ul className="list-disc pl-5 grid gap-1">
            <li>No personal information is placed in QR links.</li>
            <li>No forced registration or account.</li>
          </ul>
        </Block>
        <Block title="Your choice">
          <p>You can change your mind at any time.</p>
          <ConsentControls />
        </Block>
        <Block title="How long we keep data">
          <p>Anonymous analytics are kept only as long as needed to improve recipes and packs. In this prototype they are stored in your browser and removed when you decline or clear your data.</p>
        </Block>
        <Block title="Contact">
          <p>Questions about privacy? Email privacy@example.com (placeholder).</p>
        </Block>
      </div>
    </div>
  );
}
