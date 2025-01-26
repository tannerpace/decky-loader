/interface Window {
  SP_REACTDOM: any;
  SP_REACT: any;
  DFL: any;
  deckyAuthToken: string;
  DeckyBackend: any;
  webpackChunksteamui: any[];
}

(async () => {
  const POLL_INTERVAL = 10; // 10 ms
  const TIMEOUT = 10000; // 10 seconds

  const pollWithTimeout = async <T>(
    condition: () => T | null | undefined,
    errorMessage: string
  ): Promise<T> => {
    const start = Date.now();
    while (!condition()) {
      if (Date.now() - start > TIMEOUT) {
        throw new Error(errorMessage);
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    }
    return condition() as T;
  };

  try {
    console.time('[Decky:Boot] Waiting for main Webpack chunks...');
    await pollWithTimeout(
      () => window.webpackChunksteamui && window.webpackChunksteamui.length >= 8,
      '[Decky:Boot] Timeout waiting for main Webpack chunks!'
    );
    console.timeEnd('[Decky:Boot] Waiting for main Webpack chunks...');

    console.time('[Decky:Boot] Waiting for React root mount...');
    const root = await pollWithTimeout(
      () => {
        const rootElement = document.getElementById('root');
        return rootElement && (rootElement as any)[Object.keys(rootElement).find((k) => k.startsWith('__reactContainer$')) as string];
      },
      '[Decky:Boot] Timeout waiting for React root mount!'
    );
    console.timeEnd('[Decky:Boot] Waiting for React root mount...');

    if (!window.SP_REACT) {
      console.debug('[Decky:Boot] Setting up Webpack & React globals...');
      const DFLWebpack = await import('@decky/ui/dist/webpack');
      window.SP_REACT = DFLWebpack.findModule((m) => m.Component && m.PureComponent && m.useLayoutEffect);
      window.SP_REACTDOM = DFLWebpack.findModule((m) => m.createPortal && m.createRoot);
    }

    console.debug('[Decky:Boot] Setting up @decky/ui...');
    window.DFL = await import('@decky/ui');

    console.debug('[Decky:Boot] Authenticating with Decky backend...');
    window.deckyAuthToken = await fetch('http://127.0.0.1:1337/auth/token').then((r) => {
      if (!r.ok) throw new Error(`[Decky:Boot] Failed to fetch auth token! HTTP ${r.status}`);
      return r.text();
    });

    console.debug('[Decky:Boot] Connecting to Decky backend...');
    const WSRouter = (await import('./wsrouter')).WSRouter;
    window.DeckyBackend = new WSRouter();
    await window.DeckyBackend.connect();

    console.debug('[Decky:Boot] Starting Decky!');
    await import('./start');
  } catch (error) {
    console.error('[Decky:Boot] Error during initialization:', error);
  }
})();
