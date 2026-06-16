"use client";

import { useEffect, useId, useMemo, useState } from "react";
import WaxSeal from "./WaxSeal";

interface MemoryProvenance {
  rootHash: string;
  txHash: string;
  owner: string;
  createdAt: string;
  imageRootHash?: string;
  imageTxHash?: string;
}

interface RecallProof {
  rootHashes: string[];
  provider: string | null;
  requestId: string | null;
}

interface ProvenanceSealProps {
  proof: RecallProof;
  memories: MemoryProvenance[];
}

interface ResolvedSource {
  rootHash: string;
  txHash: string | null;
  createdAt: string | null;
}

function truncateHash(value: string): string {
  if (value.length <= 16) {
    return value;
  }

  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

function storageScanUrl(rootHash: string): string {
  return `https://storagescan-galileo.0g.ai/file?root=${encodeURIComponent(rootHash)}`;
}

function chainScanTxUrl(txHash: string): string {
  return `https://chainscan-galileo.0g.ai/tx/${txHash}`;
}

function resolveSources(
  rootHashes: string[],
  memories: MemoryProvenance[],
): ResolvedSource[] {
  return rootHashes.map((rootHash) => {
    const normalized = rootHash.toLowerCase();
    const memory = memories.find(
      (entry) =>
        entry.rootHash.toLowerCase() === normalized ||
        entry.imageRootHash?.toLowerCase() === normalized,
    );

    const isImage = memory?.imageRootHash?.toLowerCase() === normalized;

    return {
      rootHash,
      txHash: isImage ? (memory?.imageTxHash ?? null) : (memory?.txHash ?? null),
      createdAt: memory?.createdAt ?? null,
    };
  });
}

function formatSourceDate(iso: string | null): string {
  if (!iso) {
    return "A saved moment";
  }

  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProvenanceSeal({
  proof,
  memories,
}: ProvenanceSealProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const count = proof.rootHashes.length;

  const sources = useMemo(
    () => resolveSources(proof.rootHashes, memories),
    [proof.rootHashes, memories],
  );

  useEffect(() => {
    setOpen(false);
  }, [proof.requestId, proof.rootHashes.join("|")]);

  if (count === 0) {
    return null;
  }

  return (
    <div className="mt-10 border-t border-mist pt-8">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="wax-seal-interactive group flex w-full flex-col items-center gap-4 rounded-sm border border-mist/90 bg-leaf/60 px-5 py-6 text-left transition-colors duration-300 hover:bg-leaf sm:flex-row sm:items-start sm:gap-5 sm:py-5"
      >
        <WaxSeal size="lg" className="sm:mt-0.5" />
        <span className="min-w-0 flex-1 text-center sm:text-left">
          <span className="block font-display text-[1.05rem] leading-snug text-foreground sm:text-[1.1rem]">
            Drawn from {count} of your memor{count === 1 ? "y" : "ies"} · sealed
            and provably yours.
          </span>
          <span className="mt-1.5 block text-xs text-muted transition-colors group-hover:text-foreground/75">
            {open ? "Fold certificate" : "Open the provenance certificate"}
          </span>
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-brass transition-transform duration-500 sm:mt-1 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div id={panelId} className="overflow-hidden">
          <div
            className={`origin-top pt-5 ${open ? "animate-certificate-unfold" : "opacity-0"}`}
          >
            <div className="paper-leaf relative overflow-hidden rounded-sm border border-mist px-5 py-7 sm:px-7 sm:py-8">
              <div
                className="absolute left-0 top-0 h-full w-1 bg-wax/80"
                aria-hidden="true"
              />

              <div className="flex flex-col items-center border-b border-mist/80 pb-7 text-center">
                <WaxSeal size="hero" />
                <p className="mt-5 font-display text-xl text-foreground">
                  Provenance certificate
                </p>
                <p className="mx-auto mt-2 max-w-[36ch] text-sm leading-relaxed text-muted">
                  This reflection was woven only from your own saved moments,
                  then sealed so you can always trace it back.
                </p>
              </div>

              <div className="mt-7 space-y-7">
                <section>
                  <h3 className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted">
                    Source memories
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {sources.map((source) => (
                      <li
                        key={source.rootHash}
                        className="rounded-sm border border-mist/80 bg-parchment/50 px-4 py-3"
                      >
                        <p className="text-sm text-foreground">
                          {formatSourceDate(source.createdAt)}
                        </p>
                        <div className="mt-2 flex flex-col gap-1.5 text-xs text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
                          <a
                            href={storageScanUrl(source.rootHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono transition-colors hover:text-wax"
                          >
                            {truncateHash(source.rootHash)}
                          </a>
                          {source.txHash ? (
                            <a
                              href={chainScanTxUrl(source.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-colors hover:text-wax"
                            >
                              View permanent record
                            </a>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="border-t border-mist pt-6">
                  <h3 className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted">
                    Sealed inference
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-foreground/90">
                    {proof.provider ? (
                      <p>
                        <span className="text-muted">Provider </span>
                        <span className="font-mono text-xs sm:text-sm">
                          {truncateHash(proof.provider)}
                        </span>
                      </p>
                    ) : null}
                    {proof.requestId ? (
                      <p>
                        <span className="text-muted">Request </span>
                        <span className="font-mono text-xs sm:text-sm">
                          {proof.requestId}
                        </span>
                      </p>
                    ) : null}
                    {!proof.provider && !proof.requestId ? (
                      <p className="text-muted">
                        Inference details will appear here when available.
                      </p>
                    ) : null}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
