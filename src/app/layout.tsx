import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "700"],
	variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
	title: "Sovereign",
	description:
		"Geopolitical simulation tool — explore cascading effects of policy decisions across 18 countries",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${spaceGrotesk.variable} bg-surface-950 text-zinc-100 font-sans antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
