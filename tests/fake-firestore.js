/* Home-Planer tests: a stand-in for vendor-firebase.js, served in its place by tests/e2e.test.js. It offers the few
   functions the app uses. The "server" lives in the test script (window.__fs, a binding to Node), so separate browser
   profiles act as separate devices of one household. After every write the test script calls window.__fsChanged in
   every page, and the open listeners fetch their data again. */
const call = (op, arg) => window.__fs(op, JSON.parse(JSON.stringify(arg === undefined ? null : arg))).then(r => {
  if (r && r.error) throw r.error;
  return r ? r.value : undefined;
});
const clone = o => (o === undefined || o === null ? o : JSON.parse(JSON.stringify(o)));
const subs = new Set();

function snapshot(ref, value) {
  const metadata = { fromCache: false, hasPendingWrites: false };
  if (ref.type === "doc") return { id: ref.path.split("/").pop(), exists: () => value !== null && value !== undefined, data: () => clone(value), metadata };
  return { docs: (value || []).map(d => ({ id: d.id, data: () => clone(d.data) })), metadata };
}
function refresh(s) {
  call(s.ref.type === "doc" ? "get" : "list", s.ref.path).then(v => { if (subs.has(s)) s.next(snapshot(s.ref, v)); }, e => { if (subs.has(s)) { subs.delete(s); s.error(e); } });
}
window.__fsChanged = () => { subs.forEach(refresh); };

export function initializeApp(cfg, name) { return { cfg, name: name || "[DEFAULT]" }; }
export function initializeFirestore(app) { return { app }; }
export function getFirestore(app) { return { app }; }
export function persistentLocalCache() { return {}; }
export function persistentMultipleTabManager() { return {}; }
export function memoryLocalCache() { return {}; }
export function doc(db, ...seg) { return { type: "doc", path: seg.join("/") }; }
export function collection(db, ...seg) { return { type: "col", path: seg.join("/") }; }
export function onSnapshot(ref, opts, next, error) {
  const s = { ref, next, error };
  subs.add(s);
  refresh(s);
  return () => subs.delete(s);
}
export function setDoc(ref, data) { return call("set", { path: ref.path, data }); }
export function updateDoc(ref, flat) { return call("update", { path: ref.path, data: flat }); }
export function deleteDoc(ref) { return call("delete", ref.path); }
export function runTransaction(db, fn) {
  const ops = [];
  const tx = { set(ref, data) { ops.push({ path: ref.path, data }); return tx; }, delete(ref) { ops.push({ path: ref.path, data: null }); return tx; } };
  return Promise.resolve(fn(tx)).then(() => call("tx", ops));
}
export function getCountFromServer(ref) { return call("count", ref.path).then(n => ({ data: () => ({ count: n }) })); }
