import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent, FormEvent } from "react";
import { useChatMessages } from "@/hooks/useChatMessages";

const encoder = new TextEncoder();

/** A reader that yields a single SSE `event: token` chunk, then completes. */
function makeSseReader() {
  const chunks = [encoder.encode('event: token\ndata: {"token":"Hallo"}\n\n')];
  let i = 0;
  return {
    read: async () =>
      i < chunks.length
        ? { done: false, value: chunks[i++] }
        : { done: true, value: undefined },
    cancel: async () => {},
    releaseLock: () => {},
  };
}

/** A reader that yields a single plain-text chunk, then completes (fallback path). */
function makePlainReader() {
  const chunks = [encoder.encode("Hallo")];
  let i = 0;
  return {
    read: async () =>
      i < chunks.length
        ? { done: false, value: chunks[i++] }
        : { done: true, value: undefined },
    cancel: async () => {},
    releaseLock: () => {},
  };
}

function okSseResponse() {
  return { ok: true, body: { getReader: makeSseReader } };
}

function okPlainResponse() {
  return { ok: true, body: { getReader: makePlainReader } };
}

function notOkResponse() {
  return { ok: false, body: null, status: 502 };
}

/** Drive one full send through the hook's public API. */
async function send(
  result: { current: ReturnType<typeof useChatMessages> },
  text: string,
) {
  act(() => {
    result.current.handleInputChange({
      target: { value: text },
    } as ChangeEvent<HTMLTextAreaElement>);
  });
  await act(async () => {
    await result.current.handleSubmit({
      preventDefault: () => {},
    } as FormEvent<HTMLFormElement>);
  });
}

/** Extract the parsed JSON body from a recorded fetch call to `url`. */
function contextForUrl(fetchMock: ReturnType<typeof vi.fn>, url: string) {
  const call = fetchMock.mock.calls.find(([u]) => u === url);
  if (!call) return undefined;
  const init = call[1] as RequestInit;
  return JSON.parse(init.body as string).context as string | undefined;
}

describe("useChatMessages — session context", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends a context field on the SSE path (/api/chat/stream)", async () => {
    fetchMock.mockImplementation(async () => okSseResponse());

    const { result } = renderHook(() => useChatMessages());
    await send(result, "Frage 1");

    const context = contextForUrl(fetchMock, "/api/chat/stream");
    expect(context).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith("/api/chat/stream", expect.any(Object));
  });

  it("sends a context field on the fallback path (/api/chat) when SSE is not ok", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url === "/api/chat/stream" ? notOkResponse() : okPlainResponse(),
    );

    const { result } = renderHook(() => useChatMessages());
    await send(result, "Frage 1");

    expect(fetchMock).toHaveBeenCalledWith("/api/chat", expect.any(Object));
    const fallbackContext = contextForUrl(fetchMock, "/api/chat");
    expect(fallbackContext).toBeTruthy();

    // Both paths carry the same session context within one instance.
    const sseContext = contextForUrl(fetchMock, "/api/chat/stream");
    expect(fallbackContext).toBe(sseContext);
  });

  it("keeps the context stable across multiple sends in one hook instance", async () => {
    fetchMock.mockImplementation(async () => okSseResponse());

    const { result } = renderHook(() => useChatMessages());
    await send(result, "Frage 1");
    await send(result, "Frage 2");
    await send(result, "Frage 3");

    const contexts = fetchMock.mock.calls
      .filter(([u]) => u === "/api/chat/stream")
      .map(([, init]) => JSON.parse((init as RequestInit).body as string).context);

    expect(contexts.length).toBe(3);
    expect(new Set(contexts).size).toBe(1);
  });

  it("produces a different context for a fresh hook instance (simulated reload)", async () => {
    fetchMock.mockImplementation(async () => okSseResponse());

    const first = renderHook(() => useChatMessages());
    await send(first.result, "Frage 1");
    const firstContext = contextForUrl(fetchMock, "/api/chat/stream");

    fetchMock.mockClear();

    const second = renderHook(() => useChatMessages());
    await send(second.result, "Frage 1");
    const secondContext = contextForUrl(fetchMock, "/api/chat/stream");

    expect(firstContext).toBeTruthy();
    expect(secondContext).toBeTruthy();
    expect(secondContext).not.toBe(firstContext);
  });

  it("never sends the literal string 'noSession' as context", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url === "/api/chat/stream" ? notOkResponse() : okPlainResponse(),
    );

    const { result } = renderHook(() => useChatMessages());
    await send(result, "Frage 1");

    const allContexts = fetchMock.mock.calls.map(([, init]) =>
      JSON.parse((init as RequestInit).body as string).context,
    );

    expect(allContexts.length).toBeGreaterThan(0);
    for (const ctx of allContexts) {
      expect(ctx).not.toBe("noSession");
      expect(ctx).toBeTruthy();
    }
  });
});
