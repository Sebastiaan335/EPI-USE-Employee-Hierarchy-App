import "./global.css";

export const metadata = {
  title: "EPI-USE Africa Employee Management",
  description: "Manage your organization's employee hierarchy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
