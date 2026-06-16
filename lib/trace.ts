interface OgTracePayload {
  rootHashes?: string[];
  root_hashes?: string[];
  provider?: string;
  requestId?: string;
  request_id?: string;
}

export interface ComputeProof {
  rootHashes: string[];
  provider: string | null;
  requestId: string | null;
}

function parseTracePayload(raw: string): OgTracePayload | null {
  try {
    return JSON.parse(raw) as OgTracePayload;
  } catch {
    return null;
  }
}

export function extractComputeProof(
  response: Response,
  body: unknown,
): ComputeProof {
  const headerRaw =
    response.headers.get("x-0g-trace") ??
    response.headers.get("x_0g_trace") ??
    response.headers.get("X-0g-Trace");

  let trace: OgTracePayload | null = headerRaw
    ? parseTracePayload(headerRaw)
    : null;

  if (
    !trace &&
    typeof body === "object" &&
    body !== null &&
    "x_0g_trace" in body
  ) {
    trace = (body as { x_0g_trace: OgTracePayload }).x_0g_trace;
  }

  return {
    rootHashes: trace?.rootHashes ?? trace?.root_hashes ?? [],
    provider: trace?.provider ?? null,
    requestId:
      trace?.requestId ??
      trace?.request_id ??
      response.headers.get("x-request-id"),
  };
}
