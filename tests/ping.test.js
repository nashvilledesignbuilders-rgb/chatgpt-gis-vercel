import assert from 'node:assert';
import { test } from 'node:test';
import { GET } from '../app/api/ping/route.js';

test('GET /api/ping returns pong', async () => {
  const res = await GET();
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.deepStrictEqual(data, { message: 'pong' });
});
