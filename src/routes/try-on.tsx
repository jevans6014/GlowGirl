import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  CameraOff,
  Download,
  RotateCcw,
  Sparkles as SparklesIcon,
  ShoppingBag,
} from "lucide-react";
import { TRY_ON_ITEMS, type TryOnItem } from "@/lib/tryOnItems";
import { ROUTES } from "@/lib/site";
import { useSEO } from "@/hooks/useSEO";

type CamState = "idle" | "loading" | "ready" | "denied" | "error";

type Placed = { x: number; y: number; scale: number };

export default function TryOnPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cam, setCam] = useState<CamState>("idle");
  const [selected, setSelected] = useState<TryOnItem>(TRY_ON_ITEMS[0]);
  const [placed, setPlaced] = useState<Placed>({ x: 0.5, y: 0.62, scale: 1 });
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const draggingRef = useRef(false);

  useSEO({
    title: "Virtual Try-On",
    description:
      "Try GLOWGIRL jewelry on with your camera — chains, charms, hoops & nameplates. A glowy virtual fitting room.",
    path: "/try-on",
  });

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setCam("loading");
    setSnapshot(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCam("ready");
    } catch (err) {
      const name = (err as DOMException)?.name;
      setCam(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
    }
  }, []);

  // Clean up the stream on unmount.
  useEffect(() => stopCamera, [stopCamera]);

  // Reset placement to the item's default scale when switching items.
  useEffect(() => {
    setPlaced((p) => ({ ...p, scale: 1 }));
  }, [selected.id]);

  function onPointerDown(e: React.PointerEvent) {
    if (cam !== "ready") return;
    draggingRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPlaced((p) => ({ ...p, x: clamp(x, 0, 1), y: clamp(y, 0, 1) }));
  }

  function onPointerUp() {
    draggingRef.current = false;
  }

  // Composite the current video frame + jewelry overlay into a PNG.
  async function capture() {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage || cam !== "ready") return;

    const w = video.videoWidth || stage.clientWidth;
    const h = video.videoHeight || stage.clientHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror to match the on-screen (selfie) preview.
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const overlaySize = selected.defaultScale * placed.scale * w;
    const img = await svgToImage(selected.svg, overlaySize);
    // placed.x is in mirrored screen space; convert back to canvas space.
    const cx = (1 - placed.x) * w;
    const cy = placed.y * h;
    ctx.drawImage(img, cx - overlaySize / 2, cy - overlaySize / 2, overlaySize, overlaySize);

    setSnapshot(canvas.toDataURL("image/png"));
  }

  const showStage = cam === "ready";

  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="inline-block text-xs tracking-[0.32em] text-gold uppercase">
            Beta · Virtual Try-On
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl text-balance">
            Try It On <span className="text-pink-deep">✨</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-mid-gray">
            Allow camera access, pick a piece, and drag it into place. Snap a photo to
            see how it glows on you. (Proof-of-concept — assets are placeholders.)
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Stage */}
          <div
            ref={stageRef}
            className="relative aspect-[3/4] sm:aspect-video overflow-hidden rounded-3xl bg-gradient-to-br from-pink-pale via-cream to-gold-light shadow-[var(--shadow-card)]"
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* Live video (mirrored) */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 h-full w-full object-cover -scale-x-100 ${
                showStage ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Draggable jewelry overlay */}
            {showStage && (
              <button
                onPointerDown={onPointerDown}
                aria-label={`Drag ${selected.name} into place`}
                className="absolute cursor-grab touch-none active:cursor-grabbing"
                style={{
                  left: `${placed.x * 100}%`,
                  top: `${placed.y * 100}%`,
                  width: `${selected.defaultScale * placed.scale * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
                dangerouslySetInnerHTML={{ __html: selected.svg }}
              />
            )}

            {/* Idle / permission states */}
            {!showStage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                {cam === "loading" ? (
                  <p className="text-charcoal/70">Starting camera…</p>
                ) : cam === "denied" ? (
                  <>
                    <CameraOff className="h-10 w-10 text-pink-deep" />
                    <p className="font-display text-2xl">Camera access blocked</p>
                    <p className="max-w-sm text-sm text-mid-gray">
                      Enable camera permission for this site in your browser settings,
                      then try again.
                    </p>
                    <button onClick={startCamera} className="btn-secondary">
                      Try again
                    </button>
                  </>
                ) : cam === "error" ? (
                  <>
                    <CameraOff className="h-10 w-10 text-pink-deep" />
                    <p className="font-display text-2xl">No camera found</p>
                    <p className="max-w-sm text-sm text-mid-gray">
                      We couldn't access a camera on this device.
                    </p>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-10 w-10 text-gold" />
                    <p className="font-display text-2xl">Ready when you are</p>
                    <button onClick={startCamera} className="btn-primary inline-flex gap-2">
                      <Camera className="h-4 w-4" /> Start Camera
                    </button>
                    <p className="text-xs text-mid-gray">
                      Your video never leaves your device.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-2 text-sm font-medium text-charcoal/80">Choose a piece</p>
              <div className="grid grid-cols-3 gap-2 lg:grid-cols-2">
                {TRY_ON_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    aria-pressed={selected.id === item.id}
                    className={`flex flex-col items-center gap-1 rounded-2xl border p-2 transition ${
                      selected.id === item.id
                        ? "border-pink-deep bg-pink-pale"
                        : "border-border bg-white hover:border-pink-blush"
                    }`}
                  >
                    <span
                      className="h-12 w-12"
                      dangerouslySetInnerHTML={{ __html: item.svg }}
                    />
                    <span className="text-center text-[11px] leading-tight text-charcoal/80">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal/80">
                Size
              </label>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={placed.scale}
                disabled={!showStage}
                onChange={(e) => setPlaced((p) => ({ ...p, scale: Number(e.target.value) }))}
                className="w-full accent-pink-deep disabled:opacity-40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={capture}
                disabled={!showStage}
                className="btn-primary inline-flex justify-center gap-2 disabled:opacity-40"
              >
                <Camera className="h-4 w-4" /> Capture Photo
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  setCam("idle");
                  setSnapshot(null);
                }}
                disabled={cam === "idle"}
                className="btn-secondary inline-flex justify-center gap-2 disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>

            <Link to={ROUTES.shopAll} className="story-link inline-flex items-center gap-1.5 text-sm">
              <ShoppingBag className="h-4 w-4" /> Shop the real thing
            </Link>
          </div>
        </div>

        {/* Snapshot result */}
        {snapshot && (
          <div className="mt-10 rounded-3xl bg-cream p-6 text-center">
            <p className="font-display text-2xl">Your glow ✨</p>
            <img
              src={snapshot}
              alt="Your virtual try-on result"
              className="mx-auto mt-4 max-h-[420px] rounded-2xl shadow-[var(--shadow-card)]"
            />
            <a
              href={snapshot}
              download="glowgirl-tryon.png"
              className="btn-primary mt-5 inline-flex gap-2"
            >
              <Download className="h-4 w-4" /> Download
            </a>
          </div>
        )}

        <p className="mt-10 text-center text-xs text-mid-gray">
          POC note: jewelry is positioned manually. A future version can auto-anchor
          to your face/neck with on-device face tracking and use real product photos
          or 3D assets.
        </p>
      </div>
    </section>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Rasterize inline SVG markup into an Image for canvas compositing.
function svgToImage(svg: string, size: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const sized = svg.replace(
      "<svg ",
      `<svg width="${Math.round(size)}" height="${Math.round(size)}" `,
    );
    const blob = new Blob([sized], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
