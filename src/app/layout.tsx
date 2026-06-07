import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "700"],
	variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://sovereign-sim.vercel.app"),
	title: "Sovereign",
	description:
		"Geopolitical simulation tool — explore cascading effects of policy decisions across 18 countries",
	openGraph: {
		title: "Sovereign — Geopolitical Simulation",
		description:
			"Explore the cascading effects of policy decisions rippling across 18 interconnected nations.",
		url: "https://sovereign-sim.vercel.app",
		siteName: "Sovereign",
		images: [{ url: "/og-image.png", width: 1200, height: 630 }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Sovereign — Geopolitical Simulation",
		description:
			"Explore the cascading effects of policy decisions rippling across 18 interconnected nations.",
		images: ["/og-image.png"],
	},
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
				<Analytics />
			</body>
		</html>
	);
}
