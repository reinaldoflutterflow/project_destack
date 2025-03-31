import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Interceptação global do console para proteger dados sensíveis
const secureLogs = () => {
  return {
    name: 'secure-logs',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Intercepta o console.log e console.error no cliente
        if (req.url?.endsWith('.html')) {
          server.transformIndexHtml.handlers.push({
            order: 'pre',
            handler: (html) => {
              return html.replace(
                '</head>',
                `<script>
                  // Guarda as funções originais do console
                  const originalConsoleLog = console.log;
                  const originalConsoleError = console.error;
                  const originalConsoleWarn = console.warn;
                  const originalConsoleInfo = console.info;
                  
                  // Função para filtrar dados sensíveis
                  function filterSensitiveData(args) {
                    const sensitiveDataRegex = /(token|password|email|auth|user|login|session)/i;
                    
                    return args.map(arg => {
                      // Se for string com dados sensíveis
                      if (typeof arg === 'string' && sensitiveDataRegex.test(arg)) {
                        return '[DADOS SENSÍVEIS OCULTADOS]';
                      }
                      
                      // Se for objeto, verificar se é resposta de API ou contém dados sensíveis
                      if (typeof arg === 'object' && arg !== null) {
                        // Verificar se é uma resposta de API ou objeto com dados sensíveis
                        if (arg.access_token || arg.token || arg.user || arg.email || 
                            (JSON.stringify(arg).match(sensitiveDataRegex))) {
                          return '[OBJETO COM DADOS SENSÍVEIS OCULTADO]';
                        }
                      }
                      
                      return arg;
                    });
                  }
                  
                  // Sobrescreve as funções do console
                  console.log = function() {
                    const filteredArgs = filterSensitiveData(Array.from(arguments));
                    return originalConsoleLog.apply(console, filteredArgs);
                  };
                  
                  console.error = function() {
                    const filteredArgs = filterSensitiveData(Array.from(arguments));
                    return originalConsoleError.apply(console, filteredArgs);
                  };
                  
                  console.warn = function() {
                    const filteredArgs = filterSensitiveData(Array.from(arguments));
                    return originalConsoleWarn.apply(console, filteredArgs);
                  };
                  
                  console.info = function() {
                    const filteredArgs = filterSensitiveData(Array.from(arguments));
                    return originalConsoleInfo.apply(console, filteredArgs);
                  };
                  
                  // Intercepta XMLHttpRequest para ocultar dados sensíveis
                  const originalXHROpen = XMLHttpRequest.prototype.open;
                  const originalXHRSend = XMLHttpRequest.prototype.send;
                  
                  XMLHttpRequest.prototype.open = function() {
                    this._url = arguments[1];
                    return originalXHROpen.apply(this, arguments);
                  };
                  
                  XMLHttpRequest.prototype.send = function() {
                    // Intercepta a resposta
                    const originalOnReadyStateChange = this.onreadystatechange;
                    this.onreadystatechange = function() {
                      if (this.readyState === 4) {
                        // Oculta dados sensíveis no console
                        const sensitiveDataRegex = /(token|password|email|auth|user|login|session)/i;
                        if (sensitiveDataRegex.test(this._url)) {
                          console.log('[RESPOSTA DE API COM DADOS SENSÍVEIS OCULTADA]');
                        }
                      }
                      if (originalOnReadyStateChange) {
                        return originalOnReadyStateChange.apply(this, arguments);
                      }
                    };
                    return originalXHRSend.apply(this, arguments);
                  };
                  
                  // Intercepta fetch para ocultar dados sensíveis
                  const originalFetch = window.fetch;
                  window.fetch = function() {
                    const url = arguments[0];
                    return originalFetch.apply(this, arguments)
                      .then(response => {
                        const sensitiveDataRegex = /(token|password|email|auth|user|login|session)/i;
                        if (typeof url === 'string' && sensitiveDataRegex.test(url)) {
                          console.log('[RESPOSTA DE FETCH COM DADOS SENSÍVEIS OCULTADA]');
                        }
                        return response;
                      });
                  };
                </script></head>`
              );
            },
          });
        }
        next();
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), secureLogs()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
