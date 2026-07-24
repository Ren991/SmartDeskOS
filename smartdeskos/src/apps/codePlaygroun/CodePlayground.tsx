import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  Palette, 
  FileCode, 
  Terminal, 
  Play, 
  RotateCcw, 
  Columns, 
  Rows, 
  Maximize2 
} from 'lucide-react';

interface CodePlaygroundProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
}

type TabType = 'html' | 'css' | 'js' | 'console';
type LayoutType = 'split-horizontal' | 'split-vertical';

const DEFAULT_HTML = `<div class="container">
  <h1>¡Hola, CodePlayground! 👋</h1>
  <p>Editá el código en las pestañas de la izquierda y mirá los cambios en vivo.</p>
  <button id="btn">Hacé clic acá</button>
</div>`;

const DEFAULT_CSS = `body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}

.container {
  text-align: center;
  padding: 2rem;
  background-color: #1e293b;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2563eb;
}`;

const DEFAULT_JS = `const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
  console.log('¡Botón cliqueado a las:', new Date().toLocaleTimeString());
  alert('¡Funciona!');
});`;

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialHtml = DEFAULT_HTML,
  initialCss = DEFAULT_CSS,
  initialJs = DEFAULT_JS,
}) => {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);

  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [layout, setLayout] = useState<LayoutType>('split-horizontal');
  const [logs, setLogs] = useState<string[]>([]);
  const [srcDoc, setSrcDoc] = useState('');

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Escuchar mensajes provenientes del iframe (consola interceptada)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CONSOLE_LOG') {
        setLogs((prev) => [...prev, event.data.message]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Debounce para actualizar la vista previa sin saturar en cada tipeo
  useEffect(() => {
    const timeout = setTimeout(() => {
      const compiledDoc = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8" />
            <style>
              ${css}
            </style>
          </head>
          <body>
            ${html}
            <script>
              // Interceptar console.log para reenviarlo a la pestaña de consola del Playground
              (function() {
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;

                console.log = function(...args) {
                  window.parent.postMessage({ type: 'CONSOLE_LOG', message: '[LOG] ' + args.join(' ') }, '*');
                  originalLog.apply(console, args);
                };
                console.error = function(...args) {
                  window.parent.postMessage({ type: 'CONSOLE_LOG', message: '[ERROR] ' + args.join(' ') }, '*');
                  originalError.apply(console, args);
                };
                console.warn = function(...args) {
                  window.parent.postMessage({ type: 'CONSOLE_LOG', message: '[WARN] ' + args.join(' ') }, '*');
                  originalWarn.apply(console, args);
                };

                window.onerror = function(msg, url, line) {
                  window.parent.postMessage({ type: 'CONSOLE_LOG', message: '[ERROR] ' + msg + ' (Línea ' + line + ')' }, '*');
                };
              })();
            </script>
            <script>
              try {
                ${js}
              } catch (err) {
                console.error(err.message);
              }
            </script>
          </body>
        </html>
      `;
      setSrcDoc(compiledDoc);
    }, 350); // 350ms debounce

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const handleReset = () => {
    setHtml(initialHtml);
    setCss(initialCss);
    setJs(initialJs);
    setLogs([]);
  };

  const clearConsole = () => setLogs([]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Navbar / Encabezado */}
      <header className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <h1 className="font-semibold text-sm tracking-wide text-slate-200">
            CodePlayground
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Controles de Layout */}
          <button
            onClick={() => setLayout('split-horizontal')}
            className={`p-1.5 rounded transition ${
              layout === 'split-horizontal'
                ? 'bg-slate-800 text-blue-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Vista horizontal (Columna a Columna)"
          >
            <Columns className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout('split-vertical')}
            className={`p-1.5 rounded transition ${
              layout === 'split-vertical'
                ? 'bg-slate-800 text-blue-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Vista vertical (Fila a Fila)"
          >
            <Rows className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reiniciar código"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>
      </header>

      {/* Áreas principales de trabajo */}
      <div
        className={`flex-1 flex overflow-hidden ${
          layout === 'split-vertical' ? 'flex-col' : 'flex-row'
        }`}
      >
        {/* Panel Izquierdo: Editor + Consola */}
        <div
          className={`flex flex-col bg-slate-900 border-slate-800 ${
            layout === 'split-vertical'
              ? 'h-1/2 border-b'
              : 'w-1/2 border-r'
          }`}
        >
          {/* Tabs Nav */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('html')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
                  activeTab === 'html'
                    ? 'border-orange-500 text-orange-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> HTML
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
                  activeTab === 'css'
                    ? 'border-blue-500 text-blue-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" /> CSS
              </button>
              <button
                onClick={() => setActiveTab('js')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
                  activeTab === 'js'
                    ? 'border-yellow-500 text-yellow-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" /> JS
              </button>
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
                  activeTab === 'console'
                    ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> Consola
                {logs.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-emerald-400">
                    {logs.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Área de Texto del Editor */}
          <div className="flex-1 relative overflow-hidden">
            {activeTab === 'html' && (
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="Escribí código HTML acá..."
                className="w-full h-full p-4 bg-slate-900 text-slate-200 font-mono text-sm resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            )}

            {activeTab === 'css' && (
              <textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                placeholder="Escribí código CSS acá..."
                className="w-full h-full p-4 bg-slate-900 text-slate-200 font-mono text-sm resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            )}

            {activeTab === 'js' && (
              <textarea
                value={js}
                onChange={(e) => setJs(e.target.value)}
                placeholder="Escribí código JavaScript acá..."
                className="w-full h-full p-4 bg-slate-900 text-slate-200 font-mono text-sm resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            )}

            {activeTab === 'console' && (
              <div className="flex flex-col h-full bg-slate-950 p-4 font-mono text-xs overflow-y-auto">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Salida de Consola</span>
                  <button
                    onClick={clearConsole}
                    className="text-slate-500 hover:text-slate-300 transition"
                  >
                    Limpiar
                  </button>
                </div>
                {logs.length === 0 ? (
                  <p className="text-slate-600 italic">No hay registros aún.</p>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      className={`py-1 border-b border-slate-900 ${
                        log.startsWith('[ERROR]')
                          ? 'text-red-400'
                          : log.startsWith('[WARN]')
                          ? 'text-yellow-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho: Vista Previa (Iframe) */}
        <div
          className={`flex flex-col bg-white ${
            layout === 'split-vertical' ? 'h-1/2' : 'w-1/2'
          }`}
        >
          <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Vista Previa en Vivo</span>
            </div>
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            title="preview"
            sandbox="allow-scripts"
            className="w-full h-full border-none bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;