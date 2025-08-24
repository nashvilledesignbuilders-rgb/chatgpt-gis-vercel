export async function GET() {
  return new Response(
    JSON.stringify({ message: "Parcel endpoint placeholder" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
