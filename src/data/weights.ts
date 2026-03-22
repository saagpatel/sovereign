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

	energy: {
		// ── Tier 1: Major energy suppliers → importers ───────────────────────────
		RUS: {
			EUR: {
				gdpGrowthRate: {
					weight: -0.35,
					delayMonths: 2,
					mechanism:
						"European gas dependency on Russia means supply disruptions translate directly into energy-cost shocks and GDP contraction",
				},
				inflationRate: {
					weight: 0.3,
					delayMonths: 1,
					mechanism:
						"Russian gas cut-offs cause energy price surges across European consumer and industrial markets, lifting headline inflation",
				},
				energyIndependence: {
					weight: -0.25,
					delayMonths: 3,
					mechanism:
						"Supply disruption exposes EU's structural pipeline dependence, reducing measured energy independence",
				},
			},
			TUR: {
				gdpGrowthRate: {
					weight: -0.15,
					delayMonths: 3,
					mechanism:
						"Turkish reliance on Russian gas for heating and industry means supply shocks raise costs and dampen growth",
				},
				energyIndependence: {
					weight: -0.12,
					delayMonths: 2,
					mechanism:
						"Russia-Turkey pipeline dependency constrains Turkish energy diversification and lowers independence score",
				},
			},
			CHN: {
				gdpGrowthRate: {
					weight: 0.05,
					delayMonths: 5,
					mechanism:
						"Redirected cheap Russian energy exports provide below-market inputs to Chinese industry, marginally boosting growth",
				},
			},
			IND: {
				gdpGrowthRate: {
					weight: 0.06,
					delayMonths: 5,
					mechanism:
						"Discounted sanctioned Russian oil reduces Indian energy import costs, freeing fiscal space and supporting growth",
				},
			},
		},

		SAU: {
			CHN: {
				gdpGrowthRate: {
					weight: -0.2,
					delayMonths: 3,
					mechanism:
						"Saudi oil price increases raise Chinese manufacturing and transport energy costs, compressing industrial margins",
				},
				inflationRate: {
					weight: 0.15,
					delayMonths: 2,
					mechanism:
						"Higher crude prices from Saudi OPEC+ cuts flow through Chinese fuel and petrochemical prices into consumer inflation",
				},
			},
			IND: {
				gdpGrowthRate: {
					weight: -0.18,
					delayMonths: 3,
					mechanism:
						"India imports ~85% of its crude; Saudi price hikes widen the trade deficit and drag on GDP growth",
				},
				inflationRate: {
					weight: 0.2,
					delayMonths: 2,
					mechanism:
						"Elevated crude prices raise fuel subsidies and transport costs across the Indian economy, pushing inflation higher",
				},
			},
			JPN: {
				gdpGrowthRate: {
					weight: -0.15,
					delayMonths: 3,
					mechanism:
						"Japan imports virtually all its oil; Saudi-led price increases compress corporate margins and weigh on GDP",
				},
				inflationRate: {
					weight: 0.12,
					delayMonths: 2,
					mechanism:
						"Rising crude prices transmit quickly to Japanese gasoline and utility bills, lifting headline inflation",
				},
			},
			KOR: {
				gdpGrowthRate: {
					weight: -0.12,
					delayMonths: 3,
					mechanism:
						"South Korea's energy-intensive petrochemical and steel industries face margin pressure from higher Saudi crude prices",
				},
				inflationRate: {
					weight: 0.1,
					delayMonths: 2,
					mechanism:
						"Saudi OPEC+ production cuts push up Korean fuel and industrial energy prices, boosting inflation",
				},
			},
			EUR: {
				inflationRate: {
					weight: 0.15,
					delayMonths: 2,
					mechanism:
						"European energy markets price in global crude benchmarks; Saudi cuts add inflationary pressure across the bloc",
				},
				gdpGrowthRate: {
					weight: -0.1,
					delayMonths: 4,
					mechanism:
						"Higher oil prices increase European import bills, worsen trade balances, and dampen consumer spending and growth",
				},
			},
			USA: {
				inflationRate: {
					weight: 0.08,
					delayMonths: 2,
					mechanism:
						"Even with domestic shale production, global crude price rises pass through to US gasoline and transport costs",
				},
			},
			TUR: {
				inflationRate: {
					weight: 0.14,
					delayMonths: 2,
					mechanism:
						"Turkey's high energy import dependence means Saudi-driven crude increases amplify domestic inflation",
				},
				gdpGrowthRate: {
					weight: -0.1,
					delayMonths: 3,
					mechanism:
						"Oil price spikes widen Turkey's current account deficit and tighten financing conditions, slowing growth",
				},
			},
			ASN: {
				inflationRate: {
					weight: 0.1,
					delayMonths: 2,
					mechanism:
						"ASEAN economies with high energy import intensity translate Saudi price moves into domestic fuel and food inflation",
				},
				gdpGrowthRate: {
					weight: -0.08,
					delayMonths: 4,
					mechanism:
						"Higher crude prices raise input costs for ASEAN manufacturing hubs, compressing export margins and growth",
				},
			},
		},

		USA: {
			EUR: {
				energyIndependence: {
					weight: 0.1,
					delayMonths: 4,
					mechanism:
						"Increased US LNG exports to Europe provide an alternative to Russian gas, improving EU energy independence",
				},
				gdpGrowthRate: {
					weight: 0.05,
					delayMonths: 6,
					mechanism:
						"Reliable US LNG supply reduces European energy price volatility, lowering input costs and supporting growth",
				},
			},
			JPN: {
				energyIndependence: {
					weight: 0.08,
					delayMonths: 5,
					mechanism:
						"US LNG supply agreements diversify Japanese import sources, reducing dependency on Middle East and Gulf suppliers",
				},
			},
			KOR: {
				energyIndependence: {
					weight: 0.06,
					delayMonths: 5,
					mechanism:
						"US LNG long-term supply contracts give South Korea greater supply security and improve energy independence metrics",
				},
			},
			ASN: {
				energyIndependence: {
					weight: 0.05,
					delayMonths: 5,
					mechanism:
						"US LNG flows into Southeast Asian markets provide supply diversification, marginally boosting regional energy independence",
				},
			},
			GBR: {
				energyIndependence: {
					weight: 0.05,
					delayMonths: 4,
					mechanism:
						"US-UK LNG agreements and energy security cooperation reduce UK dependence on single-source European gas",
				},
			},
		},

		IRN: {
			SAU: {
				gdpGrowthRate: {
					weight: -0.08,
					delayMonths: 3,
					mechanism:
						"Iranian disruption of Gulf shipping lanes raises insurance and logistics costs for Saudi exports, reducing revenues",
				},
			},
			CHN: {
				gdpGrowthRate: {
					weight: -0.06,
					delayMonths: 4,
					mechanism:
						"Iranian sanctions reduce discounted oil flows to China, marginally raising Chinese energy import costs",
				},
			},
			EUR: {
				inflationRate: {
					weight: 0.05,
					delayMonths: 3,
					mechanism:
						"Iranian Strait of Hormuz threats raise risk premium on global crude, adding marginal inflationary pressure in Europe",
				},
			},
			IND: {
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 4,
					mechanism:
						"Reduction in sanctioned Iranian oil imports forces India to higher-cost alternatives, squeezing growth margins",
				},
			},
		},

		// ── Tier 2: Regional energy suppliers ────────────────────────────────────
		AUS: {
			ASN: {
				energyIndependence: {
					weight: 0.06,
					delayMonths: 4,
					mechanism:
						"Australian LNG exports to Southeast Asian buyers reduce ASEAN dependence on Middle East energy supplies",
				},
				gdpGrowthRate: {
					weight: 0.04,
					delayMonths: 5,
					mechanism:
						"Reliable Australian LNG supply lowers ASEAN energy costs, supporting industrial competitiveness and growth",
				},
			},
			JPN: {
				energyIndependence: {
					weight: 0.07,
					delayMonths: 3,
					mechanism:
						"Australia is Japan's largest LNG supplier; stable supply agreements directly improve Japanese energy security",
				},
			},
			KOR: {
				energyIndependence: {
					weight: 0.05,
					delayMonths: 4,
					mechanism:
						"Australian LNG long-term contracts diversify Korean energy supply and improve independence metrics",
				},
			},
		},

		NGA: {
			EUR: {
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 5,
					mechanism:
						"Nigerian LNG supply disruptions tighten European gas markets, raising input costs and dampening GDP growth",
				},
			},
			GBR: {
				gdpGrowthRate: {
					weight: -0.03,
					delayMonths: 5,
					mechanism:
						"UK relies on Nigerian LNG for part of its gas supply; disruptions add energy cost pressure and weigh on growth",
				},
			},
		},

		// ── Tier 3: Minor bilateral energy effects ────────────────────────────────
		BRA: {
			USA: {
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Brazilian ethanol and biofuel exports provide marginal energy diversification benefit to the US market",
				},
			},
			EUR: {
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Brazilian biofuel trade with Europe supports marginal energy diversification in European transport sectors",
				},
			},
		},

		CHN: {
			ASN: {
				energyIndependence: {
					weight: -0.05,
					delayMonths: 4,
					mechanism:
						"Chinese energy demand growth competes with ASEAN for LNG supply, tightening regional energy markets",
				},
			},
			IND: {
				energyIndependence: {
					weight: -0.04,
					delayMonths: 5,
					mechanism:
						"Chinese competition for Middle East and Russian energy contracts reduces Indian optionality and independence",
				},
			},
		},

		KOR: {
			ASN: {
				gdpGrowthRate: {
					weight: 0.03,
					delayMonths: 5,
					mechanism:
						"Korean petrochemical and refined energy product exports support ASEAN industrial supply chains",
				},
			},
		},

		JPN: {
			ASN: {
				gdpGrowthRate: {
					weight: 0.03,
					delayMonths: 5,
					mechanism:
						"Japanese energy technology exports and efficiency cooperation marginally support ASEAN energy productivity",
				},
			},
		},

		GBR: {
			EUR: {
				energyIndependence: {
					weight: 0.03,
					delayMonths: 4,
					mechanism:
						"North Sea gas interconnects give marginal flexibility to UK-EU energy flows and regional supply security",
				},
			},
		},

		TUR: {
			EUR: {
				energyIndependence: {
					weight: 0.04,
					delayMonths: 4,
					mechanism:
						"Turkey as a transit hub for Azerbaijani and Central Asian gas provides marginal diversification for European supply",
				},
			},
		},
	},

	military: {
		// ── USA: Alliance guarantees and NATO effects ─────────────────────────────
		USA: {
			EUR: {
				domesticStability: {
					weight: 0.15,
					delayMonths: 2,
					mechanism:
						"NATO security guarantee reinforcement reduces European threat perception, boosting domestic stability",
				},
				militarySpendingPct: {
					weight: -0.08,
					delayMonths: 6,
					mechanism:
						"Strong US security umbrella creates free-riding incentives, reducing European defence spending pressure",
				},
			},
			JPN: {
				domesticStability: {
					weight: 0.12,
					delayMonths: 2,
					mechanism:
						"US-Japan mutual defence treaty signals credible deterrence against North Korean and Chinese threats, improving stability",
				},
				militarySpendingPct: {
					weight: -0.05,
					delayMonths: 6,
					mechanism:
						"US forward-deployed forces in Japan reduce pressure for rapid Japanese defence spending increase",
				},
			},
			KOR: {
				domesticStability: {
					weight: 0.15,
					delayMonths: 2,
					mechanism:
						"US extended deterrence and 28,500 troops in Korea underpin South Korean security and stability calculations",
				},
				militarySpendingPct: {
					weight: -0.06,
					delayMonths: 6,
					mechanism:
						"US security presence partially offsets the need for Korean autonomous defence spending increases",
				},
			},
			AUS: {
				domesticStability: {
					weight: 0.1,
					delayMonths: 3,
					mechanism:
						"ANZUS alliance and AUKUS submarine partnership strengthen Australian security, supporting domestic stability",
				},
				militarySpendingPct: {
					weight: 0.05,
					delayMonths: 4,
					mechanism:
						"AUKUS commitments require Australia to meet elevated spending thresholds for nuclear submarine programme",
				},
			},
			ISR: {
				domesticStability: {
					weight: 0.08,
					delayMonths: 2,
					mechanism:
						"US military aid and diplomatic support bolster Israeli security and reduce immediate existential threat perception",
				},
				militarySpendingPct: {
					weight: 0.03,
					delayMonths: 4,
					mechanism:
						"US security cooperation encourages Israeli force modernisation investments and co-development spending",
				},
			},
			GBR: {
				domesticStability: {
					weight: 0.08,
					delayMonths: 2,
					mechanism:
						"US-UK special relationship and NATO commitment reinforces British security posture and regional stability",
				},
			},
			TUR: {
				domesticStability: {
					weight: 0.05,
					delayMonths: 3,
					mechanism:
						"NATO membership and US alliance provide Turkey with formal security guarantees, marginally improving stability",
				},
			},
			PAK: {
				domesticStability: {
					weight: -0.05,
					delayMonths: 2,
					mechanism:
						"US pressure on Pakistan over counter-terrorism and India relations creates internal political tensions",
				},
			},
		},

		// ── CHN: Regional threat expansion ────────────────────────────────────────
		CHN: {
			ASN: {
				domesticStability: {
					weight: -0.2,
					delayMonths: 2,
					mechanism:
						"Chinese South China Sea militarisation and assertive posture escalates regional threat perception, destabilising ASEAN",
				},
				militarySpendingPct: {
					weight: 0.1,
					delayMonths: 3,
					mechanism:
						"Rising Chinese military capability forces ASEAN members to increase defence budgets for regional deterrence",
				},
			},
			JPN: {
				domesticStability: {
					weight: -0.12,
					delayMonths: 2,
					mechanism:
						"Chinese PLA naval and air incursions near Senkaku Islands and Taiwan raise Japanese threat perception significantly",
				},
				militarySpendingPct: {
					weight: 0.08,
					delayMonths: 3,
					mechanism:
						"Chinese military modernisation drives Japan's historic defence spending increases toward 2% of GDP target",
				},
			},
			KOR: {
				domesticStability: {
					weight: -0.1,
					delayMonths: 2,
					mechanism:
						"Chinese military assertiveness amplifies Korean security dilemmas, particularly regarding THAAD and alliance choices",
				},
				militarySpendingPct: {
					weight: 0.06,
					delayMonths: 3,
					mechanism:
						"Growing Chinese military capability reinforces South Korea's case for expanding indigenous defence programmes",
				},
			},
			IND: {
				domesticStability: {
					weight: -0.08,
					delayMonths: 3,
					mechanism:
						"Chinese LAC incursions and border militarisation create persistent security anxiety and domestic political pressure in India",
				},
				militarySpendingPct: {
					weight: 0.05,
					delayMonths: 4,
					mechanism:
						"Chinese border aggression accelerates Indian defence modernisation and mountain-warfare capability investments",
				},
			},
			AUS: {
				domesticStability: {
					weight: -0.06,
					delayMonths: 3,
					mechanism:
						"Chinese Pacific strategy and intelligence operations in Australia create domestic political security concerns",
				},
			},
			PAK: {
				domesticStability: {
					weight: 0.05,
					delayMonths: 3,
					mechanism:
						"China-Pakistan defence partnership and CPEC security cooperation strengthen Pakistani state stability",
				},
				militarySpendingPct: {
					weight: 0.04,
					delayMonths: 4,
					mechanism:
						"Chinese arms transfers and co-production programmes expand Pakistani military capability at reduced cost",
				},
			},
			IRN: {
				domesticStability: {
					weight: 0.04,
					delayMonths: 4,
					mechanism:
						"Chinese diplomatic and economic support reduces Iranian international isolation, marginally improving regime stability",
				},
			},
			RUS: {
				militarySpendingPct: {
					weight: -0.04,
					delayMonths: 6,
					mechanism:
						"Sino-Russian strategic partnership reduces Russian perceived need for full-spectrum deterrence on eastern flank",
				},
			},
		},

		// ── RUS: Eastern European and NATO threat escalation ──────────────────────
		RUS: {
			EUR: {
				domesticStability: {
					weight: -0.15,
					delayMonths: 2,
					mechanism:
						"Russian military posture and hybrid warfare operations in Eastern Europe create security anxiety across the EU bloc",
				},
				militarySpendingPct: {
					weight: 0.12,
					delayMonths: 3,
					mechanism:
						"Russian aggression has driven historic European NATO member defence spending increases toward the 2% GDP target",
				},
			},
			TUR: {
				domesticStability: {
					weight: -0.08,
					delayMonths: 3,
					mechanism:
						"Russian Black Sea militarisation and Syrian operations create spillover security pressures on Turkey",
				},
			},
			GBR: {
				domesticStability: {
					weight: -0.06,
					delayMonths: 3,
					mechanism:
						"Russian hybrid warfare, disinformation campaigns, and assassination operations on UK soil undermine domestic security",
				},
				militarySpendingPct: {
					weight: 0.05,
					delayMonths: 4,
					mechanism:
						"Russian threat has accelerated UK defence spending commitments to NATO and bilateral Eastern European partners",
				},
			},
			USA: {
				militarySpendingPct: {
					weight: 0.04,
					delayMonths: 3,
					mechanism:
						"Russian military escalation drives US Congressional support for defence authorisation bill increases",
				},
			},
			JPN: {
				domesticStability: {
					weight: -0.03,
					delayMonths: 5,
					mechanism:
						"Russia-Ukraine war demonstrates proximity of great-power conflict, increasing Japanese security anxiety marginally",
				},
			},
		},

		// ── IRN: Middle East threat dynamics ─────────────────────────────────────
		IRN: {
			ISR: {
				domesticStability: {
					weight: -0.15,
					delayMonths: 1,
					mechanism:
						"Iranian ballistic missile and drone attacks, proxy warfare through Hezbollah, directly threaten Israeli domestic security",
				},
				militarySpendingPct: {
					weight: 0.1,
					delayMonths: 2,
					mechanism:
						"Iranian military threat drives Israeli Iron Dome expansion, Arrow system upgrades, and sustained defence spending",
				},
			},
			SAU: {
				domesticStability: {
					weight: -0.1,
					delayMonths: 2,
					mechanism:
						"Houthi attacks enabled by Iran and Iranian drone threats to Gulf infrastructure undermine Saudi security calculus",
				},
				militarySpendingPct: {
					weight: 0.08,
					delayMonths: 3,
					mechanism:
						"Iranian regional ambitions and proxy networks drive Saudi Arabia's sustained high military spending levels",
				},
			},
			TUR: {
				domesticStability: {
					weight: -0.05,
					delayMonths: 3,
					mechanism:
						"Iranian-backed instability in Iraq and Syria generates refugee flows and PKK activity affecting Turkish security",
				},
			},
			IRQ: {
				domesticStability: {
					weight: -0.06,
					delayMonths: 2,
					mechanism:
						"Iranian proxy militia networks in Iraq undermine state sovereignty and create domestic political instability",
				},
			},
			ASN: {
				domesticStability: {
					weight: -0.03,
					delayMonths: 4,
					mechanism:
						"Iranian Strait of Hormuz threats create tanker insurance costs and shipping disruption anxiety in ASEAN",
				},
			},
		},

		// ── PAK: South Asian threat dynamics ──────────────────────────────────────
		PAK: {
			IND: {
				domesticStability: {
					weight: -0.12,
					delayMonths: 2,
					mechanism:
						"Pakistani-backed cross-border terrorism, Kashmir militarisation, and nuclear signalling raise Indian security anxieties",
				},
				militarySpendingPct: {
					weight: 0.06,
					delayMonths: 3,
					mechanism:
						"Pakistan's nuclear arsenal and proxy conflict operations justify sustained Indian military modernisation spending",
				},
			},
			AFG: {
				domesticStability: {
					weight: -0.06,
					delayMonths: 3,
					mechanism:
						"Pakistani-Afghan border dynamics and Taliban relations create persistent cross-border instability",
				},
			},
		},

		// ── ISR: Regional ripple effects ──────────────────────────────────────────
		ISR: {
			JOR: {
				domesticStability: {
					weight: -0.05,
					delayMonths: 2,
					mechanism:
						"Israeli military operations in Gaza create mass Palestinian displacement and political pressure in Jordan",
				},
			},
			EUR: {
				domesticStability: {
					weight: -0.04,
					delayMonths: 3,
					mechanism:
						"Israeli-Palestinian conflict generates European domestic political tensions and pro-Palestinian protests",
				},
			},
			USA: {
				domesticStability: {
					weight: -0.03,
					delayMonths: 2,
					mechanism:
						"US support for Israel creates domestic political divisions and campus unrest, mildly affecting social stability",
				},
			},
		},

		// ── Additional tier-3 stability effects ───────────────────────────────────
		IND: {
			PAK: {
				domesticStability: {
					weight: -0.08,
					delayMonths: 2,
					mechanism:
						"Indian military posture and surgical strike doctrine creates Pakistani domestic security anxiety and political pressure",
				},
				militarySpendingPct: {
					weight: 0.07,
					delayMonths: 3,
					mechanism:
						"Indian force modernisation compels Pakistani military to seek parity, sustaining high defence spending levels",
				},
			},
			CHN: {
				militarySpendingPct: {
					weight: 0.03,
					delayMonths: 5,
					mechanism:
						"Indian military build-up on the LAC and in the Indian Ocean creates marginal pressure on Chinese border defence spending",
				},
			},
		},

		KOR: {
			JPN: {
				domesticStability: {
					weight: -0.04,
					delayMonths: 2,
					mechanism:
						"North Korean missile tests coordinated with regional tensions affect Japanese threat assessments and civilian anxiety",
				},
			},
		},

		GBR: {
			EUR: {
				domesticStability: {
					weight: 0.04,
					delayMonths: 3,
					mechanism:
						"UK bilateral security agreements with European partners post-Brexit help maintain regional stability and deterrence",
				},
			},
		},

		AUS: {
			ASN: {
				domesticStability: {
					weight: 0.03,
					delayMonths: 4,
					mechanism:
						"Australian defence posture and Pacific engagement provide marginal stabilising signal to Southeast Asian partners",
				},
			},
		},
	},

	immigration: {
		// ── Tier 1: High-volume skilled and mixed migration flows ─────────────────
		IND: {
			USA: {
				gdpGrowthRate: {
					weight: 0.08,
					delayMonths: 6,
					mechanism:
						"Indian tech talent inflow to the US fills critical STEM roles in technology and pharmaceutical sectors, boosting GDP",
				},
				techSelfSufficiency: {
					weight: 0.05,
					delayMonths: 8,
					mechanism:
						"Indian engineers and scientists contribute to US semiconductor, AI, and software leadership over medium term",
				},
			},
			GBR: {
				gdpGrowthRate: {
					weight: 0.06,
					delayMonths: 6,
					mechanism:
						"Indian professionals fill NHS, financial services, and tech gaps, supporting UK productivity and GDP growth",
				},
				domesticStability: {
					weight: -0.04,
					delayMonths: 3,
					mechanism:
						"High Indian immigration volumes generate domestic political debate and social integration pressures in the UK",
				},
			},
			AUS: {
				gdpGrowthRate: {
					weight: 0.06,
					delayMonths: 5,
					mechanism:
						"Indian skilled migration plugs Australian labour shortfalls in healthcare, engineering and IT, boosting output",
				},
				domesticStability: {
					weight: -0.03,
					delayMonths: 4,
					mechanism:
						"Large Indian diaspora growth creates housing and infrastructure pressure in Australian cities, mild social tension",
				},
			},
			EUR: {
				gdpGrowthRate: {
					weight: 0.05,
					delayMonths: 6,
					mechanism:
						"Indian IT and healthcare workers address European demographic gaps, supporting productivity and GDP growth",
				},
				domesticStability: {
					weight: -0.06,
					delayMonths: 3,
					mechanism:
						"Immigration from South Asia fuels far-right political movements and integration debates, reducing EU domestic stability",
				},
			},
			CAN: {
				gdpGrowthRate: {
					weight: 0.07,
					delayMonths: 5,
					mechanism:
						"India is Canada's top immigration source; skilled inflows directly support technology sector and GDP growth",
				},
			},
		},

		MEX: {
			USA: {
				gdpGrowthRate: {
					weight: 0.04,
					delayMonths: 4,
					mechanism:
						"Mexican labour supply in agriculture, construction and services fills structural workforce gaps, supporting US GDP",
				},
				domesticStability: {
					weight: -0.06,
					delayMonths: 2,
					mechanism:
						"Mexico-US border crossings drive domestic US political polarisation and security debates, reducing social stability",
				},
				inflationRate: {
					weight: -0.03,
					delayMonths: 6,
					mechanism:
						"Mexican labour supply in low-wage sectors puts downward pressure on US service-sector wages and consumer prices",
				},
			},
		},

		// ── Tier 2: Regional and refugee migration flows ───────────────────────────
		PAK: {
			SAU: {
				gdpGrowthRate: {
					weight: 0.03,
					delayMonths: 5,
					mechanism:
						"Pakistani remittance workers in Saudi construction and services support Gulf economic activity and Pakistani remittances",
				},
				domesticStability: {
					weight: -0.02,
					delayMonths: 4,
					mechanism:
						"Large Pakistani worker communities create minor social and administrative pressures in Saudi Arabia",
				},
			},
			GBR: {
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Pakistani diaspora in UK healthcare, transport, and retail contributes positively to UK labour market and output",
				},
				domesticStability: {
					weight: -0.03,
					delayMonths: 3,
					mechanism:
						"Pakistani immigration generates domestic political controversy and integration challenges in UK communities",
				},
			},
			UAE: {
				gdpGrowthRate: {
					weight: 0.03,
					delayMonths: 4,
					mechanism:
						"Pakistani workers are a major component of UAE construction and service sectors, supporting Emirati economic activity",
				},
			},
		},

		TUR: {
			EUR: {
				domesticStability: {
					weight: -0.08,
					delayMonths: 2,
					mechanism:
						"Turkey's role as gateway for Syrian and Afghan refugee flows creates intense EU domestic political pressure over immigration",
				},
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Turkish-origin workers and diaspora in European manufacturing and services make a marginal positive growth contribution",
				},
			},
			DEU: {
				domesticStability: {
					weight: -0.06,
					delayMonths: 2,
					mechanism:
						"Large Turkish-origin community and refugee transit dynamics generate integration debates in German politics",
				},
			},
		},

		ASN: {
			SAU: {
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 5,
					mechanism:
						"Southeast Asian domestic workers and construction labourers in Gulf states support Saudi service-sector growth",
				},
			},
			AUS: {
				gdpGrowthRate: {
					weight: 0.04,
					delayMonths: 5,
					mechanism:
						"ASEAN migrants, especially from Philippines and Vietnam, fill Australian aged-care and agricultural workforce gaps",
				},
			},
		},

		NGA: {
			EUR: {
				domesticStability: {
					weight: -0.04,
					delayMonths: 3,
					mechanism:
						"West African migration, led by Nigeria, raises EU domestic political tensions over border control and asylum policy",
				},
			},
			GBR: {
				domesticStability: {
					weight: -0.03,
					delayMonths: 3,
					mechanism:
						"Nigerian small-boat Channel crossings generate domestic UK political controversy and institutional strain",
				},
			},
		},

		IRN: {
			TUR: {
				domesticStability: {
					weight: -0.05,
					delayMonths: 2,
					mechanism:
						"Iranian refugee flows into Turkey following sanctions-driven economic collapse create social and political pressures",
				},
			},
			EUR: {
				domesticStability: {
					weight: -0.03,
					delayMonths: 3,
					mechanism:
						"Iranian asylum seekers arriving via Turkey add marginal pressure to European migration management systems",
				},
			},
			IRQ: {
				domesticStability: {
					weight: -0.04,
					delayMonths: 2,
					mechanism:
						"Iranian economic migrants seeking passage through Iraq create border and social management pressures",
				},
			},
		},

		// ── Tier 3: Brain-drain and remittance effects ────────────────────────────
		CHN: {
			USA: {
				techSelfSufficiency: {
					weight: 0.03,
					delayMonths: 8,
					mechanism:
						"Chinese-born scientists and engineers in US institutions contribute to American AI and semiconductor research capacity",
				},
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Chinese STEM diaspora in the US contributes to startup formation and technology sector output growth",
				},
			},
			AUS: {
				gdpGrowthRate: {
					weight: 0.03,
					delayMonths: 5,
					mechanism:
						"Chinese students and skilled workers contribute to Australian education revenue and professional services output",
				},
			},
		},

		BRA: {
			EUR: {
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Brazilian workers in European hospitality and construction sectors contribute marginally to EU GDP and remittances home",
				},
			},
			USA: {
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Brazilian skilled migrants and students in the US make a small positive contribution to US services and research output",
				},
			},
		},

		KOR: {
			USA: {
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Korean-American engineers and executives contribute to US technology and finance sector growth",
				},
			},
		},

		GBR: {
			EUR: {
				gdpGrowthRate: {
					weight: -0.02,
					delayMonths: 4,
					mechanism:
						"Post-Brexit UK immigration restrictions reduce EU national access to British labour markets, minor GDP drag",
				},
			},
		},

		RUS: {
			EUR: {
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 4,
					mechanism:
						"Russian emigration of skilled professionals following 2022 war adds talent to European technology and research sectors",
				},
				domesticStability: {
					weight: -0.02,
					delayMonths: 3,
					mechanism:
						"Russian emigres create minor social and political management considerations in EU member states",
				},
			},
		},

		AUS: {
			GBR: {
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Australians working in UK finance and professional services make a small contribution to British GDP",
				},
			},
		},

		SAU: {
			ASN: {
				domesticStability: {
					weight: -0.02,
					delayMonths: 4,
					mechanism:
						"Saudi deportation cycles for ASEAN workers during oil downturns create reverse migration shocks in source countries",
				},
			},
			PAK: {
				domesticStability: {
					weight: 0.03,
					delayMonths: 3,
					mechanism:
						"Saudi remittance flows to Pakistani families provide an economic safety valve, marginally reducing domestic political pressure",
				},
			},
		},

		EUR: {
			GBR: {
				gdpGrowthRate: {
					weight: 0.03,
					delayMonths: 5,
					mechanism:
						"EU freedom-of-movement workers in UK sectors make a positive contribution to UK labour productivity and GDP growth",
				},
			},
		},
	},

	monetary: {
		// ── USA: Federal Reserve → global reserve currency spillovers ─────────────
		USA: {
			EUR: {
				inflationRate: {
					weight: -0.12,
					delayMonths: 3,
					mechanism:
						"Fed rate hikes strengthen dollar, weakening euro purchasing power and raising import costs, pushing eurozone inflation",
				},
				gdpGrowthRate: {
					weight: -0.08,
					delayMonths: 4,
					mechanism:
						"Dollar appreciation and capital flight to US Treasuries tighten European financing conditions, dragging on EU GDP",
				},
			},
			CHN: {
				inflationRate: {
					weight: -0.1,
					delayMonths: 3,
					mechanism:
						"Dollar strength reduces yuan purchasing power for commodity imports, raising input costs across Chinese industry",
				},
				gdpGrowthRate: {
					weight: -0.06,
					delayMonths: 5,
					mechanism:
						"US monetary tightening reduces global liquidity available to Chinese dollar-denominated debt markets",
				},
				foreignReserves: {
					weight: -0.08,
					delayMonths: 4,
					mechanism:
						"PBoC draws on reserves to defend yuan peg under dollar appreciation pressure, reducing reserve levels",
				},
			},
			JPN: {
				inflationRate: {
					weight: -0.08,
					delayMonths: 3,
					mechanism:
						"Yen weakening against strengthening dollar raises Japanese import costs for energy and commodities, lifting inflation",
				},
				foreignReserves: {
					weight: -0.06,
					delayMonths: 4,
					mechanism:
						"BoJ yen-support interventions against dollar strength draw down Japanese foreign reserve holdings",
				},
			},
			GBR: {
				inflationRate: {
					weight: -0.06,
					delayMonths: 3,
					mechanism:
						"Sterling weakness relative to dollar raises UK import inflation, partially offsetting BoE tightening",
				},
			},
			KOR: {
				inflationRate: {
					weight: -0.06,
					delayMonths: 3,
					mechanism:
						"Won depreciation against dollar raises Korean energy and commodity import costs, adding inflationary pressure",
				},
				foreignReserves: {
					weight: -0.05,
					delayMonths: 4,
					mechanism:
						"Bank of Korea intervenes to support won, drawing down reserves during Fed tightening cycles",
				},
			},
			IND: {
				inflationRate: {
					weight: -0.06,
					delayMonths: 4,
					mechanism:
						"Rupee depreciation against the dollar raises Indian import costs for oil, electronics and capital goods",
				},
				foreignReserves: {
					weight: -0.06,
					delayMonths: 5,
					mechanism:
						"RBI intervention to smooth rupee depreciation draws on Indian foreign currency reserve buffers",
				},
			},
			BRA: {
				inflationRate: {
					weight: -0.08,
					delayMonths: 3,
					mechanism:
						"Real depreciation against a strengthening dollar raises Brazilian import prices and fuels domestic inflation",
				},
				foreignReserves: {
					weight: -0.07,
					delayMonths: 4,
					mechanism:
						"Emerging market capital outflows toward US assets draw down Brazilian FX reserve buffers significantly",
				},
			},
			TUR: {
				inflationRate: {
					weight: -0.12,
					delayMonths: 2,
					mechanism:
						"Lira vulnerability to dollar strength is acute; Fed tightening accelerates Turkish inflation and reserve depletion",
				},
				foreignReserves: {
					weight: -0.1,
					delayMonths: 3,
					mechanism:
						"CBRT reserves fall sharply as capital flees Turkish lira to dollar-denominated assets during Fed hike cycles",
				},
			},
			ASN: {
				inflationRate: {
					weight: -0.06,
					delayMonths: 4,
					mechanism:
						"ASEAN currency depreciation against the dollar raises import inflation across energy-dependent Southeast Asian economies",
				},
				foreignReserves: {
					weight: -0.05,
					delayMonths: 4,
					mechanism:
						"Capital outflows to US assets reduce ASEAN central bank reserve buffers during Fed tightening cycles",
				},
			},
			MEX: {
				inflationRate: {
					weight: -0.06,
					delayMonths: 3,
					mechanism:
						"Peso sensitivity to Fed policy means dollar strength raises Mexican import costs and domestic inflation",
				},
				foreignReserves: {
					weight: -0.05,
					delayMonths: 4,
					mechanism:
						"Banxico supports the peso during dollar surges, drawing down reserves and tightening monetary conditions",
				},
			},
			SAU: {
				foreignReserves: {
					weight: -0.03,
					delayMonths: 3,
					mechanism:
						"Riyal peg maintenance requires Saudi reserves to absorb dollar-denominated capital flow pressures",
				},
			},
			NGA: {
				inflationRate: {
					weight: -0.07,
					delayMonths: 3,
					mechanism:
						"Naira depreciation against dollar raises Nigerian import costs especially for fuel and manufactured goods",
				},
				foreignReserves: {
					weight: -0.06,
					delayMonths: 4,
					mechanism:
						"CBN depletes foreign reserves defending the naira against dollar outflow pressure during Fed tightening",
				},
			},
			PAK: {
				inflationRate: {
					weight: -0.09,
					delayMonths: 3,
					mechanism:
						"Pakistani rupee collapse under dollar strength amplifies import inflation, especially for energy and food",
				},
				foreignReserves: {
					weight: -0.08,
					delayMonths: 3,
					mechanism:
						"SBP reserves fall to critical levels under dollar-denominated debt repayment pressure during Fed tightening",
				},
			},
		},

		// ── CHN: Yuan internationalisation and regional monetary influence ────────
		CHN: {
			ASN: {
				gdpGrowthRate: {
					weight: -0.1,
					delayMonths: 4,
					mechanism:
						"Yuan devaluation cheapens Chinese exports, undercutting ASEAN export competitiveness and compressing regional GDP growth",
				},
				tradeOpenness: {
					weight: -0.08,
					delayMonths: 3,
					mechanism:
						"Chinese currency manipulation and capital controls create competitive trade distortions affecting ASEAN market access",
				},
			},
			KOR: {
				gdpGrowthRate: {
					weight: -0.08,
					delayMonths: 4,
					mechanism:
						"Yuan depreciation erodes Korean export competitiveness in third markets where Korea and China compete directly",
				},
			},
			AUS: {
				gdpGrowthRate: {
					weight: -0.06,
					delayMonths: 5,
					mechanism:
						"Chinese currency moves affect AUD through commodity trade links; yuan weakness typically weakens AUD and GDP",
				},
			},
			JPN: {
				gdpGrowthRate: {
					weight: -0.07,
					delayMonths: 4,
					mechanism:
						"Yuan devaluation undermines Japanese export competitiveness in Southeast Asian and Chinese domestic markets",
				},
			},
			IND: {
				gdpGrowthRate: {
					weight: -0.05,
					delayMonths: 5,
					mechanism:
						"Chinese monetary easing floods Indian markets with cheap Chinese goods, pressuring domestic manufacturing margins",
				},
			},
			RUS: {
				foreignReserves: {
					weight: 0.04,
					delayMonths: 4,
					mechanism:
						"China-Russia currency swap arrangements and yuan reserve accumulation support Russian reserve diversification",
				},
			},
		},

		// ── EUR: ECB spillovers ────────────────────────────────────────────────────
		EUR: {
			GBR: {
				inflationRate: {
					weight: -0.05,
					delayMonths: 3,
					mechanism:
						"ECB rate decisions affect sterling via trade and capital linkages; euro weakness tends to import UK inflation",
				},
			},
			TUR: {
				inflationRate: {
					weight: -0.06,
					delayMonths: 3,
					mechanism:
						"Euro weakness reduces Turkish export competitiveness and remittance values, adding pressure on lira and inflation",
				},
			},
			CHN: {
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 5,
					mechanism:
						"ECB tightening reduces European demand for Chinese goods, marginally reducing Chinese export revenue growth",
				},
			},
			ASN: {
				gdpGrowthRate: {
					weight: -0.03,
					delayMonths: 5,
					mechanism:
						"ECB monetary tightening reduces European capital flows to ASEAN emerging markets, raising borrowing costs slightly",
				},
			},
			USA: {
				inflationRate: {
					weight: -0.04,
					delayMonths: 4,
					mechanism:
						"Euro depreciation raises the cost of EU goods in the US, marginally contributing to US import inflation",
				},
			},
		},

		// ── Tier 2/3: Emerging market and regional monetary effects ───────────────
		JPN: {
			ASN: {
				foreignReserves: {
					weight: 0.04,
					delayMonths: 3,
					mechanism:
						"BoJ yen carry-trade dynamics affect ASEAN capital flows; yen strengthening can cause EM reserve drawdowns",
				},
			},
			KOR: {
				gdpGrowthRate: {
					weight: -0.05,
					delayMonths: 4,
					mechanism:
						"Yen depreciation cheapens Japanese exports relative to Korean goods, reducing Korean competitiveness",
				},
			},
			AUS: {
				gdpGrowthRate: {
					weight: -0.03,
					delayMonths: 5,
					mechanism:
						"Japanese yen carry-trade unwinding causes AUD volatility, creating uncertainty for Australian exporters",
				},
			},
		},

		SAU: {
			PAK: {
				foreignReserves: {
					weight: 0.05,
					delayMonths: 2,
					mechanism:
						"Saudi direct deposits to SBP and concessional financing provide critical support to Pakistan's foreign reserves",
				},
			},
			TUR: {
				foreignReserves: {
					weight: 0.04,
					delayMonths: 3,
					mechanism:
						"Gulf sovereign investment in Turkey provides reserves support during Turkish lira crises",
				},
			},
			EGY: {
				foreignReserves: {
					weight: 0.04,
					delayMonths: 2,
					mechanism:
						"Saudi deposits and grants to the CBE provide direct reserves support during Egyptian currency crises",
				},
			},
		},

		RUS: {
			TUR: {
				inflationRate: {
					weight: 0.04,
					delayMonths: 3,
					mechanism:
						"Russian ruble instability and sanctions create pricing uncertainty in Turkey-Russia bilateral trade",
				},
			},
			BRA: {
				gdpGrowthRate: {
					weight: -0.02,
					delayMonths: 5,
					mechanism:
						"Russian commodity export disruption affects global pricing of agricultural goods in which Brazil competes",
				},
			},
		},

		GBR: {
			IRL: {
				gdpGrowthRate: {
					weight: -0.03,
					delayMonths: 4,
					mechanism:
						"Sterling volatility creates trade uncertainty for Irish exporters to the UK, marginally dampening Irish GDP growth",
				},
			},
			IND: {
				foreignReserves: {
					weight: -0.02,
					delayMonths: 5,
					mechanism:
						"Sterling weakness reduces the value of Indian sterling-denominated reserves and bilateral remittance flows",
				},
			},
		},

		BRA: {
			ARG: {
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 3,
					mechanism:
						"Brazilian real volatility creates competitive pressures for Argentine exporters in shared markets",
				},
			},
		},

		TUR: {
			EUR: {
				inflationRate: {
					weight: 0.02,
					delayMonths: 4,
					mechanism:
						"Turkish lira instability creates minor inflationary pass-through via EU-Turkey goods trade linkages",
				},
			},
		},

		KOR: {
			ASN: {
				gdpGrowthRate: {
					weight: -0.03,
					delayMonths: 4,
					mechanism:
						"Won depreciation cheapens Korean exports relative to ASEAN goods, creating competitive headwinds for regional exporters",
				},
			},
		},

		IND: {
			ASN: {
				gdpGrowthRate: {
					weight: 0.02,
					delayMonths: 5,
					mechanism:
						"Rupee stability and Indian monetary cooperation with ASEAN partners supports bilateral trade and investment growth",
				},
			},
		},
	},

	technology: {
		// ── USA: Export controls, chip alliances, AI leadership ───────────────────
		USA: {
			CHN: {
				techSelfSufficiency: {
					weight: -0.3,
					delayMonths: 2,
					mechanism:
						"US export control restrictions on advanced semiconductors, EDA tools, and chip equipment directly throttle Chinese tech capability",
				},
				gdpGrowthRate: {
					weight: -0.15,
					delayMonths: 6,
					mechanism:
						"Technology sector access restrictions constrain Chinese AI, cloud, and semiconductor output, reducing GDP growth",
				},
			},
			KOR: {
				techSelfSufficiency: {
					weight: 0.08,
					delayMonths: 4,
					mechanism:
						"US-Korea chip alliance and investment incentives support Korean NAND/DRAM expansion, strengthening tech independence",
				},
				gdpGrowthRate: {
					weight: 0.05,
					delayMonths: 6,
					mechanism:
						"US semiconductor demand and CHIPS Act supply chain alignment generate Korean export and investment growth",
				},
			},
			JPN: {
				techSelfSufficiency: {
					weight: 0.06,
					delayMonths: 4,
					mechanism:
						"TSMC Kumamoto investment and US-Japan chip cooperation improve Japanese domestic semiconductor capability",
				},
				gdpGrowthRate: {
					weight: 0.04,
					delayMonths: 6,
					mechanism:
						"US technology partnership stimulates Japanese chip equipment and materials sector investment and export revenues",
				},
			},
			EUR: {
				techSelfSufficiency: {
					weight: 0.05,
					delayMonths: 5,
					mechanism:
						"US CHIPS Act allied-nation provisions and transatlantic semiconductor supply chain cooperation boost EU tech capability",
				},
				gdpGrowthRate: {
					weight: 0.03,
					delayMonths: 6,
					mechanism:
						"US technology investment and partnerships support European semiconductor manufacturing and AI ecosystem growth",
				},
			},
			IND: {
				techSelfSufficiency: {
					weight: 0.06,
					delayMonths: 6,
					mechanism:
						"US-India iCET initiative and semiconductor fab incentives accelerate Indian chip manufacturing capability development",
				},
				gdpGrowthRate: {
					weight: 0.04,
					delayMonths: 7,
					mechanism:
						"US technology transfer and partnership programmes support Indian IT services and emerging semiconductor sector",
				},
			},
			ASN: {
				techSelfSufficiency: {
					weight: 0.04,
					delayMonths: 5,
					mechanism:
						"China+1 semiconductor and electronics diversification strategy channels US investment into ASEAN manufacturing hubs",
				},
				gdpGrowthRate: {
					weight: 0.05,
					delayMonths: 5,
					mechanism:
						"US-led tech supply chain diversification into ASEAN generates significant FDI and manufacturing growth in the region",
				},
			},
			GBR: {
				techSelfSufficiency: {
					weight: 0.04,
					delayMonths: 5,
					mechanism:
						"US-UK technology cooperation including AI and quantum computing strengthens British tech sector independence",
				},
			},
			AUS: {
				techSelfSufficiency: {
					weight: 0.03,
					delayMonths: 5,
					mechanism:
						"AUKUS technology sharing and Five Eyes intelligence tech cooperation improve Australian critical technology access",
				},
			},
			ISR: {
				techSelfSufficiency: {
					weight: 0.04,
					delayMonths: 4,
					mechanism:
						"US-Israel technology partnerships in cybersecurity, AI and defence tech strengthen Israeli tech sector self-sufficiency",
				},
			},
		},

		// ── CHN: Tech competition and supply chain disruption ─────────────────────
		CHN: {
			ASN: {
				gdpGrowthRate: {
					weight: -0.12,
					delayMonths: 4,
					mechanism:
						"Chinese tech overcapacity and subsidised exports disrupt ASEAN electronics and solar manufacturing supply chains",
				},
				techSelfSufficiency: {
					weight: 0.05,
					delayMonths: 6,
					mechanism:
						"China+1 FDI diversification driven by Chinese tech risks builds ASEAN tech manufacturing capability over time",
				},
			},
			KOR: {
				gdpGrowthRate: {
					weight: -0.15,
					delayMonths: 3,
					mechanism:
						"Chinese domestic memory chip production expansion directly threatens Korean DRAM and NAND market share",
				},
				techSelfSufficiency: {
					weight: -0.06,
					delayMonths: 4,
					mechanism:
						"Chinese state-subsidised chip advancement narrows Korea's technology lead, reducing relative Korean tech capability",
				},
			},
			JPN: {
				gdpGrowthRate: {
					weight: -0.1,
					delayMonths: 4,
					mechanism:
						"Chinese EV and consumer electronics competition reduces Japanese automotive and electronics export revenues",
				},
				techSelfSufficiency: {
					weight: -0.04,
					delayMonths: 5,
					mechanism:
						"Chinese technology advancement in robotics and automation creates competitive pressure on Japanese industrial tech",
				},
			},
			USA: {
				techSelfSufficiency: {
					weight: -0.08,
					delayMonths: 4,
					mechanism:
						"Chinese cyber espionage and technology theft create supply chain vulnerabilities and IP losses that erode US tech advantage",
				},
				gdpGrowthRate: {
					weight: -0.06,
					delayMonths: 5,
					mechanism:
						"Chinese tech competition in AI, EVs, and solar reduces US market share and creates domestic industry adjustment costs",
				},
			},
			EUR: {
				techSelfSufficiency: {
					weight: -0.05,
					delayMonths: 5,
					mechanism:
						"Chinese technology acquisition of European firms and supply chain penetration creates strategic dependency risks",
				},
			},
			IND: {
				techSelfSufficiency: {
					weight: -0.04,
					delayMonths: 5,
					mechanism:
						"Chinese dominance in smartphone and telecom equipment supply chains limits Indian tech sector independence",
				},
			},
		},

		// ── KOR: Semiconductor supply and demand shocks ────────────────────────────
		KOR: {
			CHN: {
				techSelfSufficiency: {
					weight: -0.12,
					delayMonths: 2,
					mechanism:
						"Chinese dependency on Korean DRAM and NAND creates structural tech supply vulnerability for Chinese industry",
				},
				gdpGrowthRate: {
					weight: -0.08,
					delayMonths: 4,
					mechanism:
						"Korean chip supply restrictions under US export controls reduce Chinese semiconductor-dependent industry output",
				},
			},
			ASN: {
				techSelfSufficiency: {
					weight: 0.04,
					delayMonths: 5,
					mechanism:
						"Korean chipmakers' ASEAN manufacturing expansion transfers semiconductor process knowledge to regional partners",
				},
			},
			USA: {
				gdpGrowthRate: {
					weight: 0.03,
					delayMonths: 4,
					mechanism:
						"Korean semiconductor investment in US fabs (Texas, Arizona) contributes to US domestic chip output growth",
				},
			},
			JPN: {
				techSelfSufficiency: {
					weight: -0.03,
					delayMonths: 3,
					mechanism:
						"Korean-Japanese chip materials trade tensions create minor supply uncertainties for Japanese equipment makers",
				},
			},
		},

		// ── JPN: Equipment and materials choke-points ─────────────────────────────
		JPN: {
			CHN: {
				techSelfSufficiency: {
					weight: -0.08,
					delayMonths: 3,
					mechanism:
						"Japanese semiconductor equipment and photoresist export restrictions remove critical inputs from Chinese fab ramp-up",
				},
				gdpGrowthRate: {
					weight: -0.05,
					delayMonths: 5,
					mechanism:
						"Loss of Japanese equipment access slows Chinese semiconductor output capacity expansion and downstream GDP",
				},
			},
			KOR: {
				techSelfSufficiency: {
					weight: -0.06,
					delayMonths: 3,
					mechanism:
						"Japanese speciality chemical and photoresist export controls create supply risk for Korean memory chip production",
				},
				gdpGrowthRate: {
					weight: -0.04,
					delayMonths: 4,
					mechanism:
						"Japanese materials trade disruptions introduce cost and yield uncertainty into Korean semiconductor manufacturing",
				},
			},
			ASN: {
				techSelfSufficiency: {
					weight: 0.03,
					delayMonths: 5,
					mechanism:
						"Japanese technology companies' ASEAN manufacturing partnerships transfer electronics process knowledge to the region",
				},
			},
			USA: {
				techSelfSufficiency: {
					weight: 0.04,
					delayMonths: 4,
					mechanism:
						"Japanese semiconductor equipment and robotics exports strengthen US advanced manufacturing tech capability",
				},
			},
		},

		// ── EUR: Regulatory and research influence ────────────────────────────────
		EUR: {
			CHN: {
				gdpGrowthRate: {
					weight: -0.05,
					delayMonths: 6,
					mechanism:
						"EU data localisation, AI Act compliance costs, and market access barriers raise costs for Chinese tech firms in Europe",
				},
			},
			USA: {
				gdpGrowthRate: {
					weight: -0.03,
					delayMonths: 6,
					mechanism:
						"EU tech regulation including GDPR, Digital Markets Act creates compliance costs for US tech firms operating in Europe",
				},
			},
			GBR: {
				techSelfSufficiency: {
					weight: -0.03,
					delayMonths: 4,
					mechanism:
						"Post-Brexit EU research funding exclusion and regulatory divergence create barriers to UK-EU tech collaboration",
				},
			},
			IND: {
				techSelfSufficiency: {
					weight: 0.03,
					delayMonths: 6,
					mechanism:
						"EU-India tech partnership programmes and Horizon research cooperation build Indian capability in strategic tech areas",
				},
			},
		},

		// ── Tier 3: Emerging tech corridors ───────────────────────────────────────
		ISR: {
			USA: {
				techSelfSufficiency: {
					weight: 0.03,
					delayMonths: 4,
					mechanism:
						"Israeli cybersecurity and intelligence technology exports to the US strengthen American critical infrastructure protection",
				},
			},
			EUR: {
				techSelfSufficiency: {
					weight: 0.02,
					delayMonths: 5,
					mechanism:
						"Israeli AI and cybersecurity startups expand into European markets, transferring security technology capabilities",
				},
			},
		},

		GBR: {
			USA: {
				techSelfSufficiency: {
					weight: 0.03,
					delayMonths: 4,
					mechanism:
						"ARM architecture, DeepMind AI research, and UK defence tech exports contribute to US technology leadership",
				},
			},
			ASN: {
				techSelfSufficiency: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"UK-ASEAN tech trade and Fintech exports support Southeast Asian digital infrastructure development",
				},
			},
		},

		IND: {
			USA: {
				techSelfSufficiency: {
					weight: 0.03,
					delayMonths: 5,
					mechanism:
						"Indian IT services and engineering exports to the US support American software and cloud infrastructure capacity",
				},
			},
			ASN: {
				techSelfSufficiency: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Indian software and digital services exports to ASEAN support regional tech sector modernisation",
				},
			},
		},

		AUS: {
			ASN: {
				techSelfSufficiency: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Australian critical minerals supply supports ASEAN battery and electronics manufacturing tech self-sufficiency",
				},
			},
		},

		RUS: {
			CHN: {
				techSelfSufficiency: {
					weight: 0.03,
					delayMonths: 5,
					mechanism:
						"Russian mathematics, physics and software talent channels to China under Western restrictions support Chinese AI development",
				},
			},
		},

		BRA: {
			USA: {
				techSelfSufficiency: {
					weight: 0.02,
					delayMonths: 6,
					mechanism:
						"Brazilian software and fintech innovation contributes marginally to US Latin American technology market expansion",
				},
			},
		},
	},
};
