import { describe, expect, it } from "vitest";
import {
	BLOC_MEMBERS,
	COUNTRIES,
	getEntityId,
	isBloc,
	NUMERIC_TO_ENTITY,
} from "./countries";

describe("COUNTRIES", () => {
	it("has exactly 18 entries", () => {
		expect(COUNTRIES).toHaveLength(18);
	});

	it("every entry has non-empty id, name, and region", () => {
		for (const c of COUNTRIES) {
			expect(c.id).toBeTruthy();
			expect(c.name).toBeTruthy();
			expect(c.region).toBeTruthy();
		}
	});

	it("all ids are unique", () => {
		const ids = COUNTRIES.map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe("NUMERIC_TO_ENTITY", () => {
	it("maps single-country numeric codes correctly", () => {
		expect(NUMERIC_TO_ENTITY["840"]).toBe("USA");
		expect(NUMERIC_TO_ENTITY["156"]).toBe("CHN");
		expect(NUMERIC_TO_ENTITY["586"]).toBe("PAK");
		expect(NUMERIC_TO_ENTITY["392"]).toBe("JPN");
		expect(NUMERIC_TO_ENTITY["036"]).toBe("AUS");
	});

	it("maps all 27 EUR numeric IDs to EUR", () => {
		for (const numId of BLOC_MEMBERS.EUR) {
			expect(NUMERIC_TO_ENTITY[numId]).toBe("EUR");
		}
	});

	it("maps all 10 ASN numeric IDs to ASN", () => {
		for (const numId of BLOC_MEMBERS.ASN) {
			expect(NUMERIC_TO_ENTITY[numId]).toBe("ASN");
		}
	});

	it("maps all 3 SAU numeric IDs to SAU", () => {
		for (const numId of BLOC_MEMBERS.SAU) {
			expect(NUMERIC_TO_ENTITY[numId]).toBe("SAU");
		}
	});

	it("no numeric ID appears in more than one bloc", () => {
		const allBlocIds = [
			...BLOC_MEMBERS.EUR,
			...BLOC_MEMBERS.ASN,
			...BLOC_MEMBERS.SAU,
		];
		expect(new Set(allBlocIds).size).toBe(allBlocIds.length);
	});
});

describe("helper functions", () => {
	it("isBloc returns true for blocs", () => {
		expect(isBloc("EUR")).toBe(true);
		expect(isBloc("ASN")).toBe(true);
		expect(isBloc("SAU")).toBe(true);
	});

	it("isBloc returns false for single countries", () => {
		expect(isBloc("USA")).toBe(false);
		expect(isBloc("CHN")).toBe(false);
	});

	it("getEntityId resolves known numeric IDs", () => {
		expect(getEntityId("840")).toBe("USA");
		expect(getEntityId("250")).toBe("EUR");
	});

	it("getEntityId returns null for unknown IDs", () => {
		expect(getEntityId("999")).toBeNull();
		expect(getEntityId("")).toBeNull();
	});
});
