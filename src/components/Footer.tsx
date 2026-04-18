export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-fg/10 px-6 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
        <p className="tracking-wide">
          © {year} Paul Shen. All rights reserved.
        </p>
        <p className="font-mono uppercase tracking-[0.2em]">
          Built with Next.js · GSAP · Lenis
        </p>
      </div>
    </footer>
  );
}
