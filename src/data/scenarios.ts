import type { Scenario } from "@/types";

export const SCENARIOS: Scenario[] = [
	{
		id: "us-china-semis",
		title: "US Semiconductor Export Controls on China",
		description:
			"The US expands export controls on advanced semiconductors and chip manufacturing equipment to China, restricting access to sub-7nm technology.",
		lever: {
			domain: "technology",
			actingCountry: "USA",
			magnitude: -85,
			label: "Broad semiconductor export ban",
		},
		tags: ["technology", "trade", "US-China"],
		historicalAnalog: "2022-2023 BIS export control expansions",
	},
	{
		id: "russia-energy-cutoff",
		title: "Russia Cuts European Energy Supply",
		description:
			"Russia halts natural gas pipeline flows to Europe, forcing emergency substitution from LNG and alternative suppliers.",
		lever: {
			domain: "energy",
			actingCountry: "RUS",
			magnitude: -90,
			label: "Full pipeline gas cutoff to Europe",
		},
		tags: ["energy", "Russia", "Europe"],
		historicalAnalog: "2022 Nord Stream suspension",
	},
	{
		id: "china-taiwan-blockade",
		title: "China Naval Blockade of Taiwan Strait",
		description:
			"China establishes a naval exclusion zone around Taiwan, disrupting maritime trade routes and triggering alliance responses.",
		lever: {
			domain: "military",
			actingCountry: "CHN",
			magnitude: 80,
			label: "Naval exclusion zone — Taiwan Strait",
		},
		tags: ["military", "China", "Asia-Pacific"],
	},
	{
		id: "us-nato-withdrawal",
		title: "US Reduces NATO Commitment",
		description:
			"The US signals a significant reduction in Article 5 guarantees and begins withdrawing forward-deployed forces from Europe.",
		lever: {
			domain: "military",
			actingCountry: "USA",
			magnitude: -60,
			label: "Major NATO commitment drawdown",
		},
		tags: ["military", "NATO", "Europe"],
	},
	{
		id: "india-skilled-immigration",
		title: "India Opens Skilled Worker Pathways",
		description:
			"India launches a bilateral skilled worker program with major economies, accelerating outbound talent flows in tech and healthcare.",
		lever: {
			domain: "immigration",
			actingCountry: "IND",
			magnitude: 70,
			label: "Major skilled emigration liberalization",
		},
		tags: ["immigration", "India", "labor"],
	},
	{
		id: "eu-carbon-tariff",
		title: "EU Carbon Border Adjustment (CBAM)",
		description:
			"The EU imposes full carbon tariffs on imports from high-emission economies, reshaping trade flows for steel, cement, and aluminum.",
		lever: {
			domain: "trade",
			actingCountry: "EUR",
			magnitude: 65,
			label: "Full CBAM implementation",
		},
		tags: ["trade", "climate", "Europe"],
		historicalAnalog: "2023 CBAM regulation adoption",
	},
	{
		id: "china-yuan-devaluation",
		title: "China Major Yuan Devaluation",
		description:
			"China allows a significant managed devaluation of the yuan to boost export competitiveness amid economic slowdown.",
		lever: {
			domain: "monetary",
			actingCountry: "CHN",
			magnitude: -75,
			label: "Major managed yuan devaluation",
		},
		tags: ["monetary", "China", "trade"],
		historicalAnalog: "2015 yuan devaluation shock",
	},
	{
		id: "gulf-oil-production-cut",
		title: "Gulf States OPEC+ Output Cut",
		description:
			"Gulf states lead a major coordinated OPEC+ production cut, sharply reducing global oil supply and spiking energy prices.",
		lever: {
			domain: "energy",
			actingCountry: "SAU",
			magnitude: -70,
			label: "Major coordinated OPEC+ output cut",
		},
		tags: ["energy", "Gulf", "oil"],
	},
];
