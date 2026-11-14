"""Loads viewer/viewer.html (Three.js r160 + GLTFLoader + DRACOLoader, all vendored locally) in headless Chrome over CDP,
for each camera: sets the viewport, waits for the GLB to load and render, collects console / WebGL errors, saves a screenshot.
Usage: python threejs_test.py [glb_name]   (needs: Chrome, python `websockets`). Software WebGL (SwiftShader) is used, so shadows/lighting are real but slow."""
import asyncio, json, os, subprocess, sys, time, urllib.request, base64, tempfile
import websockets

HERE = os.path.dirname(os.path.abspath(__file__)); V2 = os.path.dirname(HERE)
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PAGE = "file:///" + os.path.join(V2, "viewer", "viewer.html").replace("\\", "/").replace(" ", "%20")
OUT = os.path.join(V2, "previews")
SHOTS = [("Cam_Desktop_16x9", 1600, 900, "threejs_desktop.png"), ("Cam_Tablet_4x3", 1200, 900, "threejs_tablet.png"), ("Cam_Mobile_9x16", 540, 960, "threejs_mobile.png")]
EXTRA = sys.argv[1] if len(sys.argv) > 1 else ""

async def main():
    prof = tempfile.mkdtemp(prefix="chrome_mars_")
    proc = subprocess.Popen([CHROME, "--headless=new", "--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist",
                             "--allow-file-access-from-files", "--remote-debugging-port=9333", f"--user-data-dir={prof}", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try: urllib.request.urlopen("http://127.0.0.1:9333/json/version", timeout=1); break
            except Exception: time.sleep(0.5)
        tgt = json.load(urllib.request.urlopen(urllib.request.Request("http://127.0.0.1:9333/json/new?about:blank", method="PUT")))
        async with websockets.connect(tgt["webSocketDebuggerUrl"], max_size=None) as ws:
            nid = [0]; pend = {}; logs = []
            async def reader():
                async for m in ws:
                    d = json.loads(m)
                    if "id" in d and d["id"] in pend: pend.pop(d["id"]).set_result(d)
                    elif d.get("method") == "Runtime.consoleAPICalled":
                        logs.append((d["params"]["type"], " ".join(str(a.get("value", a.get("description", ""))) for a in d["params"]["args"])))
                    elif d.get("method") == "Runtime.exceptionThrown": logs.append(("exception", d["params"]["exceptionDetails"].get("text", "") + " " + str(d["params"]["exceptionDetails"].get("exception", {}).get("description", ""))))
                    elif d.get("method") == "Log.entryAdded": logs.append((d["params"]["entry"]["level"], d["params"]["entry"]["text"] + " " + d["params"]["entry"].get("url", "")))
            asyncio.create_task(reader())
            async def send(method, **params):
                nid[0] += 1; fut = asyncio.get_event_loop().create_future(); pend[nid[0]] = fut
                await ws.send(json.dumps({"id": nid[0], "method": method, "params": params})); return (await asyncio.wait_for(fut, 300)).get("result", {})
            for dom in ("Page", "Runtime", "Log"): await send(dom + ".enable")
            for cam, w, h, fn in SHOTS:
                logs.clear()
                await send("Emulation.setDeviceMetricsOverride", width=w, height=h, deviceScaleFactor=1, mobile=False)
                await send("Page.navigate", url=f"{PAGE}?cam={cam}{EXTRA}")
                info = None; t0 = time.time()
                while time.time() - t0 < 240:
                    await asyncio.sleep(2)
                    r = await send("Runtime.evaluate", expression="JSON.stringify({ready:window.__ready,err:window.__err,info:window.__info})", returnByValue=True)
                    v = json.loads(r.get("result", {}).get("value") or "{}")
                    if v.get("ready") or v.get("err"): info = v; break
                await asyncio.sleep(1)
                shot = await send("Page.captureScreenshot", format="png")
                open(os.path.join(OUT, fn), "wb").write(base64.b64decode(shot["data"]))
                print(cam, f"{w}x{h}", json.dumps(info))
                print("  console:", [l for l in logs if l[0] in ("error", "exception", "warning", "assert")][:8] or "no errors/warnings", f"({time.time()-t0:.0f}s)")
    finally:
        proc.terminate()

asyncio.run(main())
