
import { NextResponse } from "next/server";

function mapMetroFeature(f: any) {
  const a = f.attributes || {};
  return {
    apn: a.APN ?? a.ParID ?? null,
    owner: a.Owner ?? null,
    prop_addr: a.PropAddr ?? [a.PropHouse, a.PropStreet, a.PropCity, a.PropState, a.PropZip].filter(Boolean).join(" "),
    acres: a.Acres ?? a.DeededAcreage ?? null,
    assessed_total: a.TotlAssd ?? a.TotlAppr ?? null,
    land_assessed: a.LandAssd ?? a.LandAppr ?? null,
    impr_assessed: a.ImprAssd ?? a.ImprAppr ?? null,
    geometry: f.geometry ?? null,
    raw: f
  };
}

function mapTNFeature(f: any) {
  const a = f.attributes || {};
  const addr = a.PropAddr || a.SITE_ADDR || a.SITEADD || a.SITE_ADDRESS || a.ADDRESS || null;
  const apn = a.APN || a.PARCELID || a.PARID || a.ParcelID || a.MAP_GROUP_PARCEL || null;
  return {
    apn,
    owner: a.Owner || a.OWNER || a.OWNER_NAME || null,
    prop_addr: addr,
    acres: a.ACRES || a.Acres || a.DEED_ACRES || null,
    assessed_total: a.TOT_ASSESS || a.TOTAL_APPR || a.TOTLV || null,
    land_assessed: a.LAND_ASSESS || a.LAND_APPR || null,
    impr_assessed: a.IMPR_ASSESS || a.IMPR_APPR || null,
    geometry: f.geometry ?? null,
    raw: f
  };
}

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const pinsParam = urlObj.searchParams.get("pins");
    const source = (urlObj.searchParams.get("source") || "metro").toLowerCase();

    if (!pinsParam) {
      return NextResponse.json({ error: "Missing 'pins' parameter, e.g. pins=03200001000" }, { status: 400 });
    }

    const pins = pinsParam.split(",").map(s => s.trim()).filter(Boolean);
    const results:any[] = [];

    for (const pin of pins) {
      let endpoint = "";
      if (source === "metro") {
        endpoint = `https://maps.nashville.gov/arcgis/rest/services/Cadastral/Parcels/MapServer/0/query?f=json&where=${encodeURIComponent(`APN='${pin}'`)}&outFields=*`;
      } else {
        endpoint = `https://tnmap.tn.gov/arcgis/rest/services/Parcels/MapServer/0/query?f=json&where=${encodeURIComponent(`APN='${pin}'`)}&outFields=*`;
      }
      const r = await fetch(endpoint);
      const data = await r.json();
      const feature = Array.isArray(data.features) && data.features[0] ? data.features[0] : null;
      if (feature) {
        results.push(source === "metro" ? mapMetroFeature(feature) : mapTNFeature(feature));
      } else {
        results.push({ apn: pin, error: "Not found" });
      }
    }

    return NextResponse.json({ source, count: results.length, features: results });
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
