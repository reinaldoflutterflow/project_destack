import { ref } from 'vue'

// Tipos para a resposta da API
interface User {
  id: string;
  email: string;
  role: string;
  // Outros campos do usuário conforme necessário
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
}

// Constantes
const TOKEN_KEY = 'destack_auth_token';
const USER_KEY = 'destack_user';
const LAST_ACTIVITY_KEY = 'destack_last_activity';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos em milissegundos

// Estado reativo
const currentUser = ref<User | null>(null);
const isAuthenticated = ref(false);
const accessToken = ref<string | null>(null);
const refreshToken = ref<string | null>(null);
const expiresAt = ref<number | null>(null);

// Inicializar o estado a partir do localStorage
function initAuth() {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  const storedUser = localStorage.getItem(USER_KEY);
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  
  if (storedToken && storedUser && lastActivity) {
    const now = Date.now();
    const lastActivityTime = parseInt(lastActivity, 10);
    
    // Verificar se o usuário esteve inativo por muito tempo
    if (now - lastActivityTime > INACTIVITY_TIMEOUT) {
      // Logout por inatividade
      logout();
      return;
    }
    
    // Atualizar o estado
    accessToken.value = storedToken;
    currentUser.value = JSON.parse(storedUser);
    isAuthenticated.value = true;
    
    // Atualizar o timestamp de última atividade
    updateLastActivity();
  }
}

// Atualizar o timestamp de última atividade
function updateLastActivity() {
  const now = Date.now();
  localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
}

// Login
async function login(email: string, password: string): Promise<boolean> {
  try {
    console.log('Iniciando processo de login...');
    
    // Desativar o console.log temporariamente para evitar vazamento de dados sensíveis
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    // Substituir console.log com uma versão que não exibe nada
    console.log = function() {
      // Verificar se os argumentos contêm informações sensíveis
      const args = Array.from(arguments);
      const sensitiveDataRegex = /(token|password|email|auth|user)/i;
      
      // Filtrar argumentos sensíveis
      const filteredArgs = args.map(arg => {
        if (typeof arg === 'string' && sensitiveDataRegex.test(arg)) {
          return '[DADOS SENSÍVEIS OCULTADOS]';
        }
        if (typeof arg === 'object' && arg !== null) {
          return '[OBJETO OCULTADO]';
        }
        return arg;
      });
      
      // Chamar o console.log original apenas com argumentos não sensíveis
      return originalConsoleLog.apply(console, filteredArgs);
    };
    
    console.error = function() {
      const args = Array.from(arguments);
      const sensitiveDataRegex = /(token|password|email|auth|user)/i;
      
      const filteredArgs = args.map(arg => {
        if (typeof arg === 'string' && sensitiveDataRegex.test(arg)) {
          return '[DADOS SENSÍVEIS OCULTADOS]';
        }
        if (typeof arg === 'object' && arg !== null) {
          return '[OBJETO OCULTADO]';
        }
        return arg;
      });
      
      return originalConsoleError.apply(console, filteredArgs);
    };
    
    const response = await fetch('https://n8nwebhook.paraisoambiental.com.br/webhook/8517b565-a800-4aa9-aaee-d7a39b09c832', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    console.log('Resposta da API recebida:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('Erro na resposta da API:', response.status, response.statusText);
      
      // Restaurar console original
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      
      throw new Error(`Falha na autenticação: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Dados de autenticação recebidos com sucesso');
    
    // Restaurar console original
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    
    // Verificar se os dados estão em um formato esperado
    const authData = Array.isArray(data) ? data[0] : data;
    
    if (!authData || !authData.access_token) {
      console.error('Formato de resposta inválido');
      throw new Error('Formato de resposta inválido');
    }
    
    console.log('Dados de autenticação processados com sucesso');
    
    // Armazenar os dados de autenticação
    accessToken.value = authData.access_token;
    refreshToken.value = authData.refresh_token;
    expiresAt.value = authData.expires_at;
    currentUser.value = authData.user;
    isAuthenticated.value = true;
    
    // Salvar no localStorage
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    updateLastActivity();
    
    // Configurar verificação de expiração do token
    setupTokenExpirationCheck(authData.expires_in * 1000);
    
    // Configurar monitoramento de atividade
    setupActivityMonitoring();
    
    console.log('Login realizado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro durante o processo de login');
    return false;
  }
}

// Logout
function logout() {
  // Limpar o estado
  accessToken.value = null;
  refreshToken.value = null;
  expiresAt.value = null;
  currentUser.value = null;
  isAuthenticated.value = false;
  
  // Limpar o localStorage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}

// Verificar e renovar o token antes da expiração
function setupTokenExpirationCheck(expiresIn: number) {
  // Renovar 5 minutos antes da expiração
  const refreshTime = expiresIn - (5 * 60 * 1000);
  
  setTimeout(async () => {
    if (isAuthenticated.value && refreshToken.value) {
      await refreshAuthToken();
    }
  }, refreshTime);
}

// Renovar o token de autenticação
async function refreshAuthToken() {
  if (!refreshToken.value) return;
  
  try {
    // Desativar o console.log temporariamente para evitar vazamento de dados sensíveis
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    // Substituir console.log com uma versão que filtra dados sensíveis
    console.log = function() {
      const args = Array.from(arguments);
      const sensitiveDataRegex = /(token|password|email|auth|user)/i;
      
      const filteredArgs = args.map(arg => {
        if (typeof arg === 'string' && sensitiveDataRegex.test(arg)) {
          return '[DADOS SENSÍVEIS OCULTADOS]';
        }
        if (typeof arg === 'object' && arg !== null) {
          return '[OBJETO OCULTADO]';
        }
        return arg;
      });
      
      return originalConsoleLog.apply(console, filteredArgs);
    };
    
    console.error = function() {
      const args = Array.from(arguments);
      const sensitiveDataRegex = /(token|password|email|auth|user)/i;
      
      const filteredArgs = args.map(arg => {
        if (typeof arg === 'string' && sensitiveDataRegex.test(arg)) {
          return '[DADOS SENSÍVEIS OCULTADOS]';
        }
        if (typeof arg === 'object' && arg !== null) {
          return '[OBJETO OCULTADO]';
        }
        return arg;
      });
      
      return originalConsoleError.apply(console, filteredArgs);
    };
    
    const response = await fetch('https://n8nwebhook.paraisoambiental.com.br/webhook/8517b565-a800-4aa9-aaee-d7a39b09c832', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken.value
      })
    });
    
    if (!response.ok) {
      // Restaurar console original
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      throw new Error('Falha ao renovar o token');
    }
    
    const data = await response.json();
    console.log('Dados de renovação de token recebidos com sucesso');
    
    // Restaurar console original
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    
    const authData = Array.isArray(data) ? data[0] : data;
    
    // Atualizar os dados de autenticação
    accessToken.value = authData.access_token;
    refreshToken.value = authData.refresh_token;
    expiresAt.value = authData.expires_at;
    
    // Atualizar o localStorage
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    updateLastActivity();
    
    // Configurar nova verificação de expiração
    setupTokenExpirationCheck(authData.expires_in * 1000);
    
    return true;
  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    logout();
    return false;
  }
}

// Monitorar a atividade do usuário
function setupActivityMonitoring() {
  // Lista de eventos para monitorar
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  
  // Função para atualizar a última atividade
  const activityHandler = () => {
    if (isAuthenticated.value) {
      updateLastActivity();
    }
  };
  
  // Adicionar listeners de eventos
  events.forEach(event => {
    window.addEventListener(event, activityHandler);
  });
  
  // Verificar inatividade a cada minuto
  const inactivityInterval = setInterval(() => {
    if (!isAuthenticated.value) {
      clearInterval(inactivityInterval);
      return;
    }
    
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivity) return;
    
    const now = Date.now();
    const lastActivityTime = parseInt(lastActivity, 10);
    
    if (now - lastActivityTime > INACTIVITY_TIMEOUT) {
      console.log('Logout por inatividade');
      logout();
      clearInterval(inactivityInterval);
    }
  }, 60000); // Verificar a cada minuto
}

// Obter o token para requisições autenticadas
function getAuthHeader() {
  if (accessToken.value) {
    return {
      'Authorization': `Bearer ${accessToken.value}`
    };
  }
  return {};
}

// Inicializar a autenticação ao carregar
initAuth();

export default {
  login,
  logout,
  updateLastActivity,
  getAuthHeader,
  currentUser,
  isAuthenticated,
  accessToken
};
