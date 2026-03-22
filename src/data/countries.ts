export const COUNTRIES = [
	{ id: "USA", name: "United States", region: "North America" },
	{ id: "CHN", name: "China", region: "East Asia" },
	{ id: "EUR", name: "European Union", region: "Europe" },
	{ id: "RUS", name: "Russia", region: "Eurasia" },
	{ id: "IND", name: "India", region: "South Asia" },
	{ id: "JPN", name: "Japan", region: "East Asia" },
	{ id: "KOR", name: "South Korea", region: "East Asia" },
	{ id: "ASN", name: "ASEAN", region: "Southeast Asia" },
	{ id: "BRA", name: "Brazil", region: "South America" },
	{ id: "SAU", name: "Gulf States", region: "Middle East" },
	{ id: "TUR", name: "Turkey", region: "Middle East/Europe" },
	{ id: "GBR", name: "United Kingdom", region: "Europe" },
	{ id: "AUS", name: "Australia", region: "Pacific" },
	{ id: "MEX", name: "Mexico", region: "North America" },
	{ id: "NGA", name: "Nigeria", region: "Africa" },
	{ id: "IRN", name: "Iran", region: "Middle East" },
	{ id: "ISR", name: "Israel", region: "Middle East" },
	{ id: "PAK", name: "Pakistan", region: "South Asia" },
] as const;

export type CountryId = (typeof COUNTRIES)[number]["id"];

/**
 * Maps TopoJSON numeric ISO IDs (strings) to project entity codes.
 * world-atlas countries-110m.json uses ISO 3166-1 numeric codes.
 */
export const NUMERIC_TO_ENTITY: Record<string, CountryId> = {
	// Single countries
	"840": "USA",
	"156": "CHN",
	"643": "RUS",
	"356": "IND",
	"392": "JPN",
	"410": "KOR",
	"076": "BRA",
	"792": "TUR",
	"826": "GBR",
	"036": "AUS",
	"484": "MEX",
	"566": "NGA",
	"364": "IRN",
	"376": "ISR",
	"586": "PAK",

	// EUR bloc — 27 EU member states
	"040": "EUR", // Austria
	"056": "EUR", // Belgium
	"100": "EUR", // Bulgaria
	"191": "EUR", // Croatia
	"196": "EUR", // Cyprus
	"203": "EUR", // Czechia
	"208": "EUR", // Denmark
	"233": "EUR", // Estonia
	"246": "EUR", // Finland
	"250": "EUR", // France
	"276": "EUR", // Germany
	"300": "EUR", // Greece
	"348": "EUR", // Hungary
	"372": "EUR", // Ireland
	"380": "EUR", // Italy
	"428": "EUR", // Latvia
	"440": "EUR", // Lithuania
	"442": "EUR", // Luxembourg
	"470": "EUR", // Malta
	"528": "EUR", // Netherlands
	"616": "EUR", // Poland
	"620": "EUR", // Portugal
	"642": "EUR", // Romania
	"703": "EUR", // Slovakia
	"705": "EUR", // Slovenia
	"724": "EUR", // Spain
	"752": "EUR", // Sweden

	// ASN bloc — 10 ASEAN member states
	"096": "ASN", // Brunei
	"116": "ASN", // Cambodia
	"360": "ASN", // Indonesia
	"418": "ASN", // Laos
	"458": "ASN", // Malaysia
	"104": "ASN", // Myanmar
	"608": "ASN", // Philippines
	"702": "ASN", // Singapore
	"764": "ASN", // Thailand
	"704": "ASN", // Vietnam

	// SAU bloc — Gulf States (Saudi/UAE/Qatar)
	"682": "SAU", // Saudi Arabia
	"784": "SAU", // UAE
	"634": "SAU", // Qatar
};

/** Numeric IDs belonging to each bloc */
export const BLOC_MEMBERS = {
	EUR: [
		"040",
		"056",
		"100",
		"191",
		"196",
		"203",
		"208",
		"233",
		"246",
		"250",
		"276",
		"300",
		"348",
		"372",
		"380",
		"428",
		"440",
		"442",
		"470",
		"528",
		"616",
		"620",
		"642",
		"703",
		"705",
		"724",
		"752",
	],
	ASN: ["096", "104", "116", "360", "418", "458", "608", "702", "764", "704"],
	SAU: ["682", "784", "634"],
} as const;

/** Representative country for label anchoring (centroid) */
export const BLOC_REPRESENTATIVE = {
	EUR: "250", // France
	ASN: "360", // Indonesia
	SAU: "682", // Saudi Arabia
} as const;

/** ISO-3 to ISO-2 mapping for World Bank API (Phase 4) */
export const ISO3_TO_ISO2: Record<string, string> = {
	USA: "US",
	CHN: "CN",
	RUS: "RU",
	IND: "IN",
	JPN: "JP",
	KOR: "KR",
	BRA: "BR",
	TUR: "TR",
	GBR: "GB",
	AUS: "AU",
	MEX: "MX",
	NGA: "NG",
	IRN: "IR",
	ISR: "IL",
	PAK: "PK",
	EUR: "EU",
	ASN: "Z4",
	SAU: "SA",
};

const BLOC_IDS = new Set(["EUR", "ASN", "SAU"]);

export function isBloc(id: string): boolean {
	return BLOC_IDS.has(id);
}

export function getEntityId(numericId: string): CountryId | null {
	return NUMERIC_TO_ENTITY[numericId] ?? null;
}
