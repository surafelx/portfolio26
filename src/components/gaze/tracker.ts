/**
 * Camera + MediaPipe's face landmarker, running entirely in the browser: frames never leave the device.
 * The library and model load from public CDNs only when someone turns eye mode on.
 */
import { headPose } from "./model";

const VISION = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
const MODEL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export type Reading =
  | { ok: false }
  | { ok: true; pose: number[]; landmarks: { x: number; y: number; z: number }[]; blend: Record<string, number> };

/* eslint-disable @typescript-eslint/no-explicit-any */
// Loaded from a URL at run time, so the bundler must not try to resolve it.
const importUrl = new Function("u", "return import(u)") as (u: string) => Promise<any>;

export class Tracker {
  private landmarker: any = null;
  private stream: MediaStream | null = null;
  private lastTime = -1;
  private last: Reading = { ok: false };
  video: HTMLVideoElement | null = null;

  async start(onProgress: (msg: string) => void) {
    if (!window.isSecureContext) throw new Error("The camera needs a secure connection (HTTPS).");
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser can't use a camera.");

    onProgress("Asking for the camera…");
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    });
    const video = document.createElement("video");
    video.playsInline = true;
    video.muted = true;
    video.srcObject = this.stream;
    await video.play();
    this.video = video;

    onProgress("Loading the face model (about 4 MB, once)…");
    const { FaceLandmarker, FilesetResolver } = await importUrl(`${VISION}/vision_bundle.mjs`);
    const files = await FilesetResolver.forVisionTasks(`${VISION}/wasm`);
    this.landmarker = await FaceLandmarker.createFromOptions(files, {
      baseOptions: { modelAssetPath: MODEL, delegate: "GPU" },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
    });
  }

  /** The latest face reading. The model only runs when the camera has a new frame. */
  read(nowMs: number): Reading {
    const v = this.video;
    if (!this.landmarker || !v || v.readyState < 2) return { ok: false };
    if (v.currentTime === this.lastTime) return this.last;
    this.lastTime = v.currentTime;
    const res = this.landmarker.detectForVideo(v, nowMs);
    const lm = res.faceLandmarks?.[0];
    const mat = res.facialTransformationMatrixes?.[0];
    if (!lm || !mat) return (this.last = { ok: false });
    const blend: Record<string, number> = {};
    for (const c of res.faceBlendshapes?.[0]?.categories ?? []) blend[c.categoryName] = c.score;
    return (this.last = { ok: true, pose: headPose(mat.data), landmarks: lm, blend });
  }

  stop() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.video = null;
    this.landmarker?.close?.();
    this.landmarker = null;
  }
}
