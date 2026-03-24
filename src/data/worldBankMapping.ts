import type { ScalarVariable } from "@/types";

export const WB_INDICATORS: Record<string, ScalarVariable> = {
	"NY.GDP.MKTP.KD.ZG": "gdpGrowthRate",
	"NE.TRD.GNFS.ZS": "tradeOpenness",
	"MS.MIL.XPND.GD.ZS": "militarySpendingPct",
	"SM.POP.NETM": "immigrationRate",
	"DT.DOD.DECT.GD.ZS": "debtToGdp",
	"NY.GDP.DEFL.KD.ZG": "inflationRate",
	"FI.RES.TOTL.MO": "foreignReserves",
};

export const WB_API_BASE = "https://api.worldbank.org/v2";
