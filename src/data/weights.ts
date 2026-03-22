import type { WeightMatrix } from "@/types";

export const WEIGHT_MATRIX: WeightMatrix = {
	trade: {
		// ── Tier 1: High-volume bilateral ────────────────────────────────────────
		USA: {
			CHN: {
				gdpGrowthRate: {
					weight: -0.35,
					delayMonths: 3,
					mechanism:
						"US tariff escalation reduces Chinese export revenues, contracting industrial output and GDP growth",
				},
				tradeOpenness: {
					weight: -0.4,
					delayMonths: 1,
					mechanism:
						"Direct tariff and quota measures close Chinese market access, compressing bilateral trade openness index",
				},
				inflationRate: {
					weight: 0.15,
					delayMonths: 4,
					mechanism:
						"Supply-chain disruptions from US decoupling raise input costs for Chinese manufacturers, feeding domestic inflation",
				},
			},
			EUR: {
				gdpGrowthRate: {
					weight: -0.1,
					delayMonths: 4,
					mechanism:
						"US trade restrictions disrupt transatlantic supply chains, dampening European export demand and GDP",
				},
				tradeOpenness: {
					weight: -0.15,
					delayMonths: 2,
					mechanism:
						"US non-tariff barriers and sanctions reduce the volume of EU-US bilateral commerce, tightening openness index",
				},
			},
			MEX: {
				tradeOpenness: {
					weight: 0.3,
					delayMonths: 2,
					mechanism:
						"USMCA trade facilitation and nearshoring incentives expand Mexico's trade openness as firms relocate production",
				},
				gdpGrowthRate: {
					weight: 0.2,
					delayMonths: 4,
					mechanism:
						"Increased US demand for Mexican manufactured goods and nearshored services lifts Mexican GDP growth",
				},
			},
			IND: {
				gdpGrowthRate: {
					weight: 0.1,
					delayMonths: 5,
					mechanism:
						"US trade diversification away from China redirects sourcing toward India, boosting export-led growth",
				},
				tradeOpenness: {
					weight: 0.12,
					delayMonths: 3,
					mechanism:
						"Bilateral trade agreement discussions and preferential access expand India's integration in global trade flows",
				},
			},
			GBR: {
				gdpGrowthRate: {
					weight: -0.08,
					delayMonths: 3,
					mechanism:
						"US trade policy uncertainty disrupts transatlantic financial services and goods trade, weighing on UK growth",
				},
			},
			JPN: {
				gdpGrowthRate: {
					weight: -0.1,
					delayMonths: 4,
					mechanism:
						"US import restrictions on autos and electronics reduce Japanese export revenues and dampen industrial output",
				},
			},
			KOR: {
				gdpGrowthRate: {
					weight: -0.1,
					delayMonths: 3,
					mechanism:
						"US tariffs on steel, semiconductors and consumer electronics reduce Korean export competitiveness and growth",
				},
			},
			AUS: {
				gdpGrowthRate: {
					weight: -0.08,
					delayMonths: 5,
					mechanism:
						"US trade realignments shift commodity and agricultural markets, affecting Australian export prices and GDP",
				},
			},
		},

		CHN: {
			USA: {
				inflationRate: {
					weight: 0.25,
					delayMonths: 2,
					mechanism:
						"Chinese export restrictions and retaliatory tariffs raise US consumer goods prices, lifting inflation",
				},
				gdpGrowthRate: {
					weight: -0.15,
					delayMonths: 4,
					mechanism:
						"Disrupted Chinese imports tighten US supply chains, raising costs for downstream industries and slowing GDP",
				},
			},
			EUR: {
				inflationRate: {
					weight: 0.2,
					delayMonths: 3,
					mechanism:
						"Chinese import restrictions and dumping in third markets displace EU exports, while supply shocks raise input costs",
				},
				gdpGrowthRate: {
					weight: -0.12,
					delayMonths: 5,
					mechanism:
						"Chinese overcapacity flooding EU markets depresses prices and squeezes margins for European manufacturers",
				},
			},
			ASN: {
				gdpGrowthRate: {
					weight: -0.25,
					delayMonths: 3,
					mechanism:
						"Chinese demand contraction reduces ASEAN commodity and intermediate-goods exports, cutting regional GDP growth",
				},
				tradeOpenness: {
					weight: 0.15,
					delayMonths: 6,
					mechanism:
						"China redirects supply chains through ASEAN to circumvent tariffs, increasing ASEAN trade integration over time",
				},
			},
			KOR: {
				gdpGrowthRate: {
					weight: -0.3,
					delayMonths: 2,
					mechanism:
						"Korea's deep integration in Chinese value chains means Chinese slowdowns rapidly reduce Korean semiconductor and parts exports",
				},
				tradeOpenness: {
					weight: -0.2,
					delayMonths: 3,
					mechanism:
						"Chinese trade barriers and technology restrictions compress bilateral trade flows, reducing Korea's openness index",
				},
			},
			JPN: {
				gdpGrowthRate: {
					weight: -0.2,
					delayMonths: 3,
					mechanism:
						"Reduced Chinese demand for Japanese machinery, chemicals and precision equipment cuts export revenues and GDP",
				},
				tradeOpenness: {
					weight: -0.15,
					delayMonths: 4,
					mechanism:
						"Chinese trade restrictions and preferential treatment of domestic suppliers reduce Japan's bilateral trade openness",
				},
			},
			IND: {
				gdpGrowthRate: {
					weight: -0.12,
					delayMonths: 4,
					mechanism:
						"Chinese dumping of subsidised goods in Indian markets undercuts domestic industry, weighing on Indian GDP",
				},
			},
			AUS: {
				gdpGrowthRate: {
					weight: -0.18,
					delayMonths: 3,
					mechanism:
						"Chinese sanctions and reduced demand for Australian iron ore, coal and agricultural exports contract GDP growth",
				},
				tradeOpenness: {
					weight: -0.15,
					delayMonths: 2,
					mechanism:
						"Chinese targeted trade restrictions on Australian commodities and wine directly compress bilateral trade openness",
				},
			},
			RUS: {
				gdpGrowthRate: {
					weight: -0.1,
					delayMonths: 4,
					mechanism:
						"Chinese demand shifts away from Russian commodities reduce Russian export revenue and fiscal space",
				},
			},
			SAU: {
				gdpGrowthRate: {
					weight: -0.12,
					delayMonths: 4,
					mechanism:
						"Reduced Chinese energy demand softens Gulf crude oil prices, cutting Saudi export revenues and GDP growth",
				},
			},
			BRA: {
				gdpGrowthRate: {
					weight: -0.15,
					delayMonths: 4,
					mechanism:
						"Contraction in Chinese demand for Brazilian soy, iron ore and beef directly reduces Brazilian export income and GDP",
				},
			},
		},

		EUR: {
			CHN: {
				gdpGrowthRate: {
					weight: -0.2,
					delayMonths: 3,
					mechanism:
						"EU anti-dumping duties and market access restrictions reduce Chinese export volumes, dampening Chinese GDP growth",
				},
				tradeOpenness: {
					weight: -0.25,
					delayMonths: 2,
					mechanism:
						"EU subsidy probes, tariffs on EVs and reciprocal trade measures directly reduce China-EU bilateral trade openness",
				},
			},
			TUR: {
				gdpGrowthRate: {
					weight: -0.15,
					delayMonths: 3,
					mechanism:
						"EU customs union pressures and trade restrictions reduce Turkish export competitiveness and growth prospects",
				},
				tradeOpenness: {
					weight: -0.12,
					delayMonths: 2,
					mechanism:
						"EU regulatory barriers and trade safeguard measures compress Turkey-EU bilateral trade volumes",
				},
			},
			GBR: {
				gdpGrowthRate: {
					weight: -0.12,
					delayMonths: 2,
					mechanism:
						"Post-Brexit trade friction between EU and UK raises compliance costs and reduces goods trade, weighing on UK growth",
				},
			},
			IND: {
				gdpGrowthRate: {
					weight: -0.08,
					delayMonths: 5,
					mechanism:
						"EU free trade agreement negotiations and market access decisions affect Indian textile and pharmaceutical export prospects",
				},
			},
			USA: {
				gdpGrowthRate: {
					weight: -0.08,
					delayMonths: 5,
					mechanism:
						"EU trade countermeasures and regulatory divergence raise costs for US firms operating in Europe, affecting bilateral growth",
				},
			},
		},

		RUS: {
			EUR: {
				gdpGrowthRate: {
					weight: -0.08,
					delayMonths: 6,
					mechanism:
						"Russian energy supply disruptions and commodity export restrictions raise European input costs and drag on GDP growth",
				},
			},
		},

		JPN: {
			KOR: {
				gdpGrowthRate: {
					weight: -0.12,
					delayMonths: 2,
					mechanism:
						"Japan's export controls on semiconductor materials reduce Korean chipmaker output capacity and value-added growth",
				},
				tradeOpenness: {
					weight: -0.1,
					delayMonths: 3,
					mechanism:
						"Japan-Korea trade tensions restrict bilateral flows of industrial chemicals and precision components",
				},
			},
			CHN: {
				gdpGrowthRate: {
					weight: 0.05,
					delayMonths: 4,
					mechanism:
						"Japanese FDI and technology exports to China support Chinese industrial upgrading and marginal GDP gains",
				},
			},
		},

		// ── Tier 2: Moderate ─────────────────────────────────────────────────────
		IND: {
			ASN: {
				gdpGrowthRate: {
					weight: 0.08,
					delayMonths: 5,
					mechanism:
						"Indian trade expansion through ASEAN FTA channels lifts regional demand and supports ASEAN GDP growth",
				},
			},
		},

		MEX: {
			USA: {
				gdpGrowthRate: {
					weight: 0.05,
					delayMonths: 3,
					mechanism:
						"Mexican nearshored production capacity reduces US supply-chain costs and supports US industrial output growth",
				},
			},
		},

		SAU: {
			CHN: {
				gdpGrowthRate: {
					weight: 0.08,
					delayMonths: 5,
					mechanism:
						"Saudi-Chinese oil supply agreements and petrochemical trade support Chinese industrial energy security and growth",
				},
			},
			IND: {
				gdpGrowthRate: {
					weight: -0.05,
					delayMonths: 5,
					mechanism:
						"Gulf energy price increases raise Indian import costs, widening the trade deficit and dampening GDP growth",
				},
			},
			JPN: {
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 5,
					mechanism:
						"Gulf crude price volatility raises Japanese energy import costs, squeezing industrial margins and growth",
				},
			},
			KOR: {
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 5,
					mechanism:
						"Gulf energy pricing directly affects Korean refinery and petrochemical input costs, moderating growth prospects",
				},
			},
		},

		// ── Tier 3: Low-volume ────────────────────────────────────────────────────
		NGA: {
			EUR: {
				gdpGrowthRate: {
					weight: -0.03,
					delayMonths: 6,
					mechanism:
						"Nigerian oil supply disruptions marginally tighten global energy markets, adding to European input cost pressures",
				},
			},
			CHN: {
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 5,
					mechanism:
						"Nigerian commodity export volatility creates minor supply-chain uncertainty for Chinese raw-material importers",
				},
			},
		},

		IRN: {
			CHN: {
				gdpGrowthRate: {
					weight: -0.05,
					delayMonths: 5,
					mechanism:
						"Iranian sanctioned-oil discounts provide marginal energy cost relief to Chinese refiners, supporting growth",
				},
			},
			TUR: {
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 4,
					mechanism:
						"Iran-Turkey trade under sanctions pressure creates regulatory risk and reduces certainty for bilateral commerce",
				},
			},
		},

		ISR: {
			USA: {
				gdpGrowthRate: {
					weight: -0.03,
					delayMonths: 4,
					mechanism:
						"Israeli tech exports and defence trade with the US create minor supply-chain dependencies that affect bilateral growth margins",
				},
			},
			EUR: {
				gdpGrowthRate: {
					weight: -0.03,
					delayMonths: 5,
					mechanism:
						"Israeli-EU trade agreement provisions affect agricultural and technology flows, with marginal GDP implications",
				},
			},
		},

		PAK: {
			CHN: {
				gdpGrowthRate: {
					weight: -0.05,
					delayMonths: 4,
					mechanism:
						"CPEC-related Pakistani import dependence on Chinese goods creates minor feedback into Chinese construction and infrastructure exports",
				},
			},
			SAU: {
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 5,
					mechanism:
						"Pakistani worker remittances and trade links with Gulf States create minor bilateral GDP sensitivities",
				},
			},
		},

		BRA: {
			CHN: {
				gdpGrowthRate: {
					weight: 0.06,
					delayMonths: 5,
					mechanism:
						"Brazilian soy and iron ore exports to China rise with Chinese demand, generating positive feedback on Chinese resource security",
				},
			},
			EUR: {
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 6,
					mechanism:
						"Mercosur-EU trade frictions over agricultural standards create mild growth drag through reduced market access",
				},
			},
		},

		AUS: {
			CHN: {
				gdpGrowthRate: {
					weight: 0.07,
					delayMonths: 3,
					mechanism:
						"Australian commodity exports (iron ore, LNG) provide Chinese industry with essential inputs, supporting Chinese GDP growth",
				},
			},
		},

		GBR: {
			EUR: {
				gdpGrowthRate: {
					weight: -0.06,
					delayMonths: 3,
					mechanism:
						"UK trade policy shifts post-Brexit create regulatory divergence costs that dampen EU-UK goods and services flows",
				},
			},
			USA: {
				gdpGrowthRate: {
					weight: -0.05,
					delayMonths: 4,
					mechanism:
						"UK-US bilateral trade agreement negotiations affect financial services and agricultural market access, with mild GDP implications",
				},
			},
		},

		TUR: {
			EUR: {
				gdpGrowthRate: {
					weight: -0.05,
					delayMonths: 4,
					mechanism:
						"Turkish trade policy divergence and currency volatility create uncertainty for EU exporters in Turkish markets",
				},
			},
		},

		KOR: {
			CHN: {
				gdpGrowthRate: {
					weight: 0.06,
					delayMonths: 3,
					mechanism:
						"Korean intermediate-goods and semiconductor exports to China support Chinese technology manufacturing and GDP growth",
				},
			},
		},

		ASN: {
			CHN: {
				gdpGrowthRate: {
					weight: 0.07,
					delayMonths: 3,
					mechanism:
						"ASEAN final-assembly and component exports to China feed Chinese industrial supply chains and support GDP growth",
				},
			},
		},
	},

	energy: {},
	military: {},
	immigration: {},
	monetary: {},
	technology: {},
};
