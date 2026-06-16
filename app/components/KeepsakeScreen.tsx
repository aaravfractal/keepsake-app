"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { compressImageForUpload } from "@/lib/compress-image";
import ProvenanceSeal from "./ProvenanceSeal";
import WaxSeal from "./WaxSeal";

interface MemoryProvenance {
  rootHash: string;
  txHash: string;
  owner: string;
  createdAt: string;
  hasPhoto?: boolean;
}

interface RecallProof {
  rootHashes: string[];
  provider: string | null;
  requestId: string | null;
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 8.5V6.5a4 4 0 1 1 8 0v2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect
        x="4.5"
        y="8.5"
        width="11"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="10" cy="12.5" r="1" fill="currentColor" />
    </svg>
  );
}

function formatMemoryDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return `Today · ${date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function KeepsakeScreen() {
  const [memoryText, setMemoryText] = useState("");
  const [memoryImage, setMemoryImage] = useState<File | null>(null);
  const [memoryImagePreview, setMemoryImagePreview] = useState<string | null>(
    null,
  );
  const [memorySaving, setMemorySaving] = useState(false);
  const [savedVisible, setSavedVisible] = useState(false);
  const [photoWarning, setPhotoWarning] = useState<string | null>(null);
  const [saveStampKey, setSaveStampKey] = useState(0);
  const [memoryError, setMemoryError] = useState<string | null>(null);

  const [memories, setMemories] = useState<MemoryProvenance[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(true);

  const [reflectQuery, setReflectQuery] = useState("");
  const [reflecting, setReflecting] = useState(false);
  const [story, setStory] = useState<string | null>(null);
  const [proof, setProof] = useState<RecallProof | null>(null);
  const [reflectError, setReflectError] = useState<string | null>(null);

  const loadMemories = useCallback(async () => {
    setMemoriesLoading(true);
    try {
      const response = await fetch("/api/memories");
      const data = (await response.json()) as {
        memories?: MemoryProvenance[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Could not load your vault.");
      }

      setMemories(data.memories ?? []);
    } catch (error) {
      setMemoryError(
        error instanceof Error ? error.message : "Could not load your vault.",
      );
    } finally {
      setMemoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMemories();
  }, [loadMemories]);

  useEffect(() => {
    if (!memoryImage) {
      setMemoryImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(memoryImage);
    setMemoryImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [memoryImage]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setMemoryImage(file);
    setMemoryError(null);
    setPhotoWarning(null);
  }

  function clearSelectedImage() {
    setMemoryImage(null);
  }

  async function parseJsonResponse(response: Response) {
    const raw = await response.text();

    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      throw new Error("Unexpected server response. Please try again.");
    }
  }

  async function handleSaveMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = memoryText.trim();
    if (!text || memorySaving) {
      return;
    }

    setMemorySaving(true);
    setMemoryError(null);
    setPhotoWarning(null);
    setSavedVisible(false);

    try {
      let response: Response;

      if (memoryImage) {
        const compressed = await compressImageForUpload(memoryImage);
        const formData = new FormData();
        formData.append("text", text);
        formData.append(
          "image",
          new File([compressed], "memory.jpg", { type: "image/jpeg" }),
        );

        response = await fetch("/api/memory", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("/api/memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }

      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Could not save this moment.",
        );
      }

      const photoUploaded = data.photoUploaded === true;
      const warning =
        typeof data.warning === "string" ? data.warning : null;

      setMemoryText("");
      setMemoryImage(null);
      setSavedVisible(true);
      setSaveStampKey((key) => key + 1);

      if (memoryImage && !photoUploaded) {
        setPhotoWarning(
          warning ?? "Memory saved — photo couldn't be attached.",
        );
      }

      await loadMemories();
    } catch (error) {
      setMemoryError(
        error instanceof Error ? error.message : "Could not save this moment.",
      );
    } finally {
      setMemorySaving(false);
    }
  }

  async function handleReflect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reflecting) {
      return;
    }

    setReflecting(true);
    setReflectError(null);
    setStory(null);
    setProof(null);

    try {
      const response = await fetch("/api/recall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: reflectQuery.trim() }),
      });

      const data = (await response.json()) as {
        story?: string;
        proof?: RecallProof;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Could not weave a reflection.");
      }

      setStory(data.story ?? null);
      setProof(data.proof ?? null);
    } catch (error) {
      setReflectError(
        error instanceof Error ? error.message : "Could not weave a reflection.",
      );
    } finally {
      setReflecting(false);
    }
  }

  const timelineEntries = [...memories].reverse();

  return (
    <div className="min-h-full text-foreground">
      <div className="mx-auto flex w-full max-w-[36rem] flex-col px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
        <header className="animate-fade-up mb-14 text-center sm:mb-16">
          <p className="mb-3 text-[0.6875rem] uppercase tracking-[0.24em] text-muted">
            Your private companion
          </p>
          <h1 className="font-display text-[2.75rem] leading-none tracking-[-0.02em] text-foreground sm:text-5xl">
            Keepsake
          </h1>
          <p className="mx-auto mt-5 max-w-[28ch] text-[1.05rem] leading-relaxed text-muted">
            Capture a moment. Return to it when you&apos;re ready to reflect.
          </p>
        </header>

        <section className="animate-fade-up mb-16 [animation-delay:80ms]">
          <form onSubmit={handleSaveMemory}>
            <label htmlFor="memory" className="sr-only">
              Write a memory
            </label>
            <div className="paper-leaf rounded-sm border border-mist">
              <textarea
                id="memory"
                value={memoryText}
                onChange={(event) => setMemoryText(event.target.value)}
                placeholder="What do you want to remember?"
                rows={4}
                className="w-full resize-none bg-transparent px-5 py-4 font-reading text-[1.0625rem] leading-[1.7] text-foreground placeholder:text-muted/75 focus:outline-none"
              />
              <div className="border-t border-mist/80 px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-sm border border-mist px-3 py-2 text-sm text-muted transition-colors hover:bg-leaf/70 hover:text-foreground">
                    Add a photo
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={memorySaving}
                      onChange={handleImageChange}
                    />
                  </label>
                  {memoryImage ? (
                    <button
                      type="button"
                      disabled={memorySaving}
                      onClick={clearSelectedImage}
                      className="text-sm text-muted transition-colors hover:text-foreground disabled:opacity-50"
                    >
                      Remove photo
                    </button>
                  ) : null}
                </div>
                {memoryImagePreview ? (
                  <div className="mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={memoryImagePreview}
                      alt="Selected memory photo"
                      className="h-20 w-20 rounded-sm border border-mist object-cover"
                    />
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-mist/80 px-4 py-3">
                <div className="min-h-10 flex-1 space-y-1">
                  {savedVisible ? (
                    <span className="inline-flex items-center gap-3 text-sm text-muted">
                      <WaxSeal size="sm" stamp key={saveStampKey} />
                      Saved to your private vault
                    </span>
                  ) : null}
                  {photoWarning ? (
                    <p className="text-sm text-muted">{photoWarning}</p>
                  ) : null}
                  {memoryError ? (
                    <p className="text-sm text-wax/90">{memoryError}</p>
                  ) : null}
                </div>
                <button
                  type="submit"
                  disabled={!memoryText.trim() || memorySaving}
                  className="rounded-sm border border-mist bg-transparent px-5 py-2.5 text-sm tracking-[0.02em] text-foreground transition-colors duration-200 hover:bg-leaf/80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {memorySaving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="animate-fade-up mb-16 [animation-delay:140ms]">
          <div className="mb-6">
            <h2 className="font-display text-[1.65rem] text-foreground">
              Your vault
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Encrypted moments, catalogued in time.
            </p>
          </div>

          <div className="relative pl-5">
            <div
              className="absolute bottom-1 left-[9px] top-1 w-px bg-mist"
              aria-hidden="true"
            />

            {memoriesLoading ? (
              <p className="animate-gentle-pulse py-6 pl-7 text-sm text-muted">
                Opening your vault…
              </p>
            ) : memories.length === 0 ? (
              <p className="py-6 pl-7 text-sm leading-relaxed text-muted">
                Nothing here yet. Your first memory will be stitched into this
                spine.
              </p>
            ) : (
              <ul className="space-y-0.5">
                {timelineEntries.map((memory, index) => {
                  const isNewest = index === 0;

                  return (
                    <li
                      key={`${memory.rootHash}-${memory.createdAt}`}
                      className="relative flex items-center gap-3 py-3 pl-7"
                    >
                      <span
                        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      >
                        {isNewest ? (
                          <WaxSeal size="mark" />
                        ) : (
                          <span className="block h-2 w-2 rounded-full bg-brass ring-2 ring-background" />
                        )}
                      </span>
                      <LockIcon className="h-3.5 w-3.5 shrink-0 text-brass" />
                      {memory.hasPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`/api/memory/thumbnail/${encodeURIComponent(memory.rootHash)}`}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-sm border border-mist object-cover"
                        />
                      ) : null}
                      <time
                        dateTime={memory.createdAt}
                        className="text-[0.9375rem] tracking-[0.01em] text-foreground/90"
                      >
                        {formatMemoryDate(memory.createdAt)}
                      </time>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="animate-fade-up [animation-delay:200ms]">
          <div className="mb-6">
            <h2 className="font-display text-[1.65rem] text-foreground">
              Reflect
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Ask a question and let your memories answer in a story.
            </p>
          </div>

          <form onSubmit={handleReflect} className="space-y-4">
            <div className="paper-leaf rounded-sm border border-mist px-4 py-3">
              <label htmlFor="reflect" className="sr-only">
                Reflection prompt
              </label>
              <input
                id="reflect"
                type="text"
                value={reflectQuery}
                onChange={(event) => setReflectQuery(event.target.value)}
                placeholder="What would you like to revisit?"
                className="w-full bg-transparent px-1 py-2 font-reading text-base text-foreground placeholder:text-muted/75 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={reflecting || memories.length === 0}
              className="w-full rounded-sm border border-mist bg-transparent px-5 py-3 text-sm tracking-[0.02em] text-foreground transition-colors duration-200 hover:bg-leaf/80 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {reflecting ? "Weaving your story…" : "Reflect"}
            </button>
          </form>

          {reflectError ? (
            <p className="mt-4 text-sm text-wax/90">{reflectError}</p>
          ) : null}

          {story ? (
            <div className="relative mt-12">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(ellipse_at_center,rgba(221,214,204,0.35),transparent_70%)]"
                aria-hidden="true"
              />
              <div
                key={`${proof?.requestId ?? "reflection"}-${story.length}`}
                className="animate-story-surface relative"
              >
                <article className="mx-auto max-w-[62ch] border-l border-brass/35 pl-6 sm:pl-7">
                  <p className="mb-5 text-[0.8125rem] tracking-[0.08em] text-muted">
                    from your memories.
                  </p>
                  <p className="font-reading text-[1.3rem] leading-[1.85] tracking-[0.008em] text-foreground sm:text-[1.375rem]">
                    {story}
                  </p>
                </article>

                {proof ? (
                  <div className="mx-auto max-w-[62ch]">
                    <ProvenanceSeal proof={proof} memories={memories} />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
