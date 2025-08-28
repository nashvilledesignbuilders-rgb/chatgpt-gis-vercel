
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const pin = urlObj.searchParams.get("pin");
    const where = urlObj.searchParams.get("where");

    if (!pin && !where) {
      return NextResponse.json({ error: "Provide 'pin' or 'where' query parameter" }, { status: 400 });
    }

    const whereClause = pin ? `PIN='${pin}'` : where;
    // Replace the example TN service below with a specific TNMap FeatureServer if you have one
    const endpoint = `https://tnmap.tn.gov/arcgis/rest/services/Parcels/MapServer/0/query?f=json&where=${encodeURIComponent(whereClause)}&outFields=*`;

    const res = await fetch(endpoint);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
