
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const pin = urlObj.searchParams.get("pin");
    const where = urlObj.searchParams.get("where");

    if (!pin && !where) {
      return NextResponse.json({ error: "Provide pin or where query param" }, { status: 400 });
    }

    const whereClause = pin ? `PIN='${pin}'` : where;
    const endpoint = `https://maps.nashville.gov/arcgis/rest/services/Cadastral/Parcels/MapServer/0/query?f=json&where=${encodeURIComponent(whereClause)}&outFields=*`;

    const res = await fetch(endpoint);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
