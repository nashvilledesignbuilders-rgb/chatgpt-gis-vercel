
export default function Home() {
  return (
    <main style={{maxWidth: 800, margin: '2rem auto'}}>
      <h1>ChatGPT GIS API</h1>
      <p>This deployment exposes API endpoints that ChatGPT can call via the OpenAPI spec.</p>
      <ul>
        <li>/api/parcel-summary?pins=PIN1,PIN2</li>
        <li>/api/metro?pin=...</li>
        <li>/api/tn?pin=...</li>
      </ul>
      <p>See <code>/openapi.yaml</code> and <code>/ai-plugin.json</code> at the site root.</p>
    </main>
  );
}
