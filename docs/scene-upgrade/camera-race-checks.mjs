/**
 * Run from any directory:
 *   node docs/scene-upgrade/camera-race-checks.mjs
 *
 * Exercises the current mapRef.ts flyTo function, extracted with TypeScript's
 * parser. Uses the project's existing TypeScript dependency; installs nothing.
 * FakeMap models MapLibre's synchronous moveend when stop interrupts a flight.
 * This checks ownership and event ordering, not browser geometry or animation.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const sourceUrl = new URL('../../prototype/src/map/mapRef.ts', import.meta.url);
const resultUrl = new URL('./camera-race-checks.json', import.meta.url);
const temporaryUrl = new URL(`./.camera-race-implementation-${process.pid}.mjs`, import.meta.url);
const require = createRequire(new URL('../../prototype/package.json', import.meta.url));
const ts = require('typescript');
const source = await readFile(sourceUrl, 'utf8');
const parsed = ts.createSourceFile('mapRef.ts', source, ts.ScriptTarget.Latest, true);
const declaration = parsed.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'flyTo');
assert.ok(declaration, 'mapRef.ts must export flyTo');
const extracted = declaration.getText(parsed).replace(/^export\s+/, '');
const wrapped = `export function createCameraHarness(deps) {
  let cameraRequest = 0;
  const { whenMap, getMap, window, cameraPadding } = deps;
  ${extracted}
  return { flyTo };
}`;
const compiled = ts.transpileModule(wrapped, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;

class FakeMap {
  listeners = new Set();
  moving = false;
  stopCalls = 0;
  launches = [];
  throwOnFly = false;
  once(event, callback) {
    assert.equal(event, 'moveend');
    this.listeners.add(callback);
  }
  off(event, callback) {
    assert.equal(event, 'moveend');
    this.listeners.delete(callback);
  }
  emitMoveend() {
    for (const callback of [...this.listeners]) {
      if (!this.listeners.delete(callback)) continue;
      callback();
    }
  }
  stop() {
    this.stopCalls++;
    if (!this.moving) return;
    this.moving = false;
    this.emitMoveend();
  }
  flyTo(options) {
    // MapLibre flyTo itself calls stop before starting its new animation.
    this.stop();
    if (this.throwOnFly) throw new Error('Simulated map failure');
    this.launches.push(options);
    this.moving = true;
  }
  finish() {
    this.moving = false;
    this.emitMoveend();
  }
}

const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
const cases = [];
let createCameraHarness;
function harness({ pending = false } = {}) {
  const map = new FakeMap();
  let current = map;
  let timerId = 0;
  const timers = new Map();
  const ready = deferred();
  const api = createCameraHarness({
    whenMap: () => pending ? ready.promise : Promise.resolve(current),
    getMap: () => current,
    cameraPadding: () => ({ top: 64, bottom: 100, left: 16, right: 16 }),
    window: {
      setTimeout: callback => { const id = ++timerId; timers.set(id, callback); return id; },
      clearTimeout: id => { timers.delete(id); },
    },
  });
  return { ...api, map, timers, ready, replaceMap: next => { current = next; } };
}
async function check(id, description, run) {
  try {
    await run();
    cases.push({ id, description, status: 'passed' });
  } catch (error) {
    cases.push({ id, description, status: 'failed', error: error.stack });
  }
}

try {
  await writeFile(temporaryUrl, compiled, 'utf8');
  ({ createCameraHarness } = await import(temporaryUrl.href));

  await check('old-moveend', 'Stopping the old flight settles only the old promise; the new flight remains active.', async () => {
    const h = harness();
    let oldSettled = false;
    let newSettled = false;
    const old = h.flyTo([1, 1], 4).then(() => { oldSettled = true; });
    await flush();
    const next = h.flyTo([2, 2], 5).then(() => { newSettled = true; });
    await flush();
    assert.equal(oldSettled, true);
    assert.equal(newSettled, false);
    assert.equal(h.map.moving, true);
    assert.equal(h.map.listeners.size, 1);
    h.map.finish();
    await Promise.all([old, next]);
    assert.equal(newSettled, true);
    assert.equal(h.timers.size, 0);
  });

  await check('stale-abort', 'Aborting the old controller cannot stop a newer owned flight.', async () => {
    const h = harness();
    const older = new AbortController();
    const newer = new AbortController();
    const old = h.flyTo([1, 1], 4, 2200, older.signal);
    await flush();
    const next = h.flyTo([2, 2], 5, 2200, newer.signal);
    await flush();
    const stops = h.map.stopCalls;
    older.abort();
    assert.equal(h.map.stopCalls, stops);
    assert.equal(h.map.moving, true);
    h.map.finish();
    await Promise.all([old, next]);
  });

  await check('owner-abort', 'Aborting the current owner stops its flight and removes listeners and timer.', async () => {
    const h = harness();
    const owner = new AbortController();
    const flight = h.flyTo([1, 1], 4, 2200, owner.signal);
    await flush();
    const stops = h.map.stopCalls;
    owner.abort();
    await flight;
    assert.equal(h.map.stopCalls, stops + 1);
    assert.equal(h.map.moving, false);
    assert.equal(h.map.listeners.size, 0);
    assert.equal(h.timers.size, 0);
  });

  await check('scene-exit-after-external-flight', 'Scene cleanup cannot stop a newer flight started outside the scene without a signal.', async () => {
    const h = harness();
    const sceneOwner = new AbortController();
    const scene = h.flyTo([1, 1], 4, 2200, sceneOwner.signal);
    await flush();
    const external = h.flyTo([2, 2], 5);
    await flush();
    const stops = h.map.stopCalls;
    sceneOwner.abort();
    assert.equal(h.map.stopCalls, stops);
    assert.equal(h.map.moving, true);
    assert.deepEqual(h.map.launches.at(-1).center, [2, 2]);
    h.map.finish();
    await Promise.all([scene, external]);
  });

  await check('latest-pending-map', 'When the map arrives late, only the latest queued request launches.', async () => {
    const h = harness({ pending: true });
    const older = h.flyTo([1, 1], 4);
    const newer = h.flyTo([2, 2], 5);
    h.ready.resolve(h.map);
    await flush();
    assert.equal(h.map.launches.length, 1);
    assert.deepEqual(h.map.launches[0].center, [2, 2]);
    h.map.finish();
    await Promise.all([older, newer]);
  });

  await check('aborted-pending-map', 'A request aborted before map readiness never starts an animation.', async () => {
    const h = harness({ pending: true });
    const owner = new AbortController();
    const flight = h.flyTo([1, 1], 4, 2200, owner.signal);
    owner.abort();
    h.ready.resolve(h.map);
    await flight;
    assert.equal(h.map.launches.length, 0);
    assert.equal(h.map.stopCalls, 0);
  });

  await check('map-replacement', 'A late old map instance cannot receive the queued camera request after replacement.', async () => {
    const h = harness({ pending: true });
    const flight = h.flyTo([1, 1], 4);
    h.replaceMap(new FakeMap());
    h.ready.resolve(h.map);
    await flight;
    assert.equal(h.map.launches.length, 0);
  });

  await check('timeout-cleanup', 'The timeout fallback resolves and removes listeners without forcing a camera stop.', async () => {
    const h = harness();
    const flight = h.flyTo([1, 1], 4);
    await flush();
    assert.equal(h.timers.size, 1);
    const stops = h.map.stopCalls;
    [...h.timers.values()][0]();
    await flight;
    assert.equal(h.map.stopCalls, stops);
    assert.equal(h.map.listeners.size, 0);
    assert.equal(h.timers.size, 0);
  });

  await check('invalid-or-preaborted', 'Invalid coordinates and already-aborted requests do not move the map.', async () => {
    const h = harness();
    const owner = new AbortController();
    owner.abort();
    await h.flyTo([NaN, 1], 4);
    await h.flyTo([1, Infinity], 4);
    await h.flyTo([1, 1], 4, 2200, owner.signal);
    assert.equal(h.map.stopCalls, 0);
    assert.equal(h.map.launches.length, 0);
  });

  await check('throwing-map', 'A map animation error settles the request and removes its timer and listener.', async () => {
    const h = harness();
    h.map.throwOnFly = true;
    await h.flyTo([1, 1], 4);
    assert.equal(h.map.listeners.size, 0);
    assert.equal(h.timers.size, 0);
  });
} finally {
  await unlink(temporaryUrl).catch(error => { if (error.code !== 'ENOENT') throw error; });
}

const failed = cases.filter(test => test.status === 'failed');
const report = {
  generatedAt: new Date().toISOString(),
  command: 'node docs/scene-upgrade/camera-race-checks.mjs',
  source: 'prototype/src/map/mapRef.ts',
  sourceSha256: createHash('sha256').update(source).digest('hex'),
  method: 'Execute the current flyTo function extracted through the TypeScript AST, with isolated camera ownership state and a FakeMap that emits synchronous moveend on interrupted animation.',
  scope: 'Camera request ownership, cancellation, pending readiness, event order, cleanup. Does not verify rendered map position, real browser animation, SceneStudio effect wiring, or layout.',
  passed: cases.length - failed.length,
  failed: failed.length,
  cases,
};
await writeFile(resultUrl, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`${report.passed}/${cases.length} camera race checks passed. Results: ${fileURLToPath(resultUrl)}`);
for (const failure of failed) console.error(`${failure.id}: ${failure.error}`);
if (failed.length) process.exitCode = 1;
