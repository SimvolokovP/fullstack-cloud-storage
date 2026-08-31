import { Footer } from "./footer";
import { Header } from "./header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 w-full">
        <div className="pb-24 md:py-8 lg:pb-8">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
