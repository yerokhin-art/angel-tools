import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const layoutStyles = style({
  display: "flex",
  flexDirection: "column",
  height: "screen",
  width: "full",
  backgroundColor: "base",
});

const mainStyles = style({
  display: "flex",
  flexGrow: 1,
  overflow: "hidden",
});

const contentStyles = style({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  overflow: "hidden",
  backgroundColor: "layer-2",
});

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={layoutStyles}>
      <Header />
      <main className={mainStyles}>
        <Sidebar />
        <div className={contentStyles}>{children}</div>
      </main>
    </div>
  );
}
