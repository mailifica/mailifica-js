import type { ReactElement } from 'react';

/**
 * Renderiza templates React para HTML
 */
export async function renderReactEmail(react: ReactElement): Promise<string> {
  try {
    // Dynamic import to avoid hard dependency on react-dom when not using react templates
    const reactDomServerModule = 'react-dom/server';
    const reactServer = (await import(/* @vite-ignore */ reactDomServerModule)) as {
      renderToStaticMarkup: (element: ReactElement) => string;
    };
    return reactServer.renderToStaticMarkup(react);
  } catch {
    throw new Error(
      'Para utilizar templates React (`react:`), certifique-se de ter `react` e `react-dom` instalados no seu projeto.',
    );
  }
}
