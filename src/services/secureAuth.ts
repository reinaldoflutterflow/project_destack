/**
 * Serviço de autenticação seguro que oculta dados sensíveis
 * Este serviço encapsula as chamadas de API para autenticação
 * e garante que dados sensíveis não sejam expostos
 */

import { ref } from 'vue'

// Tipos para a resposta da API
interface User {
  id: string;
  email: string;
  role: string;
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
const accessToken = ref<string | null>(null);
const refreshToken = ref<string | null>(null);
const expiresAt = ref<number | null>(null);
const currentUser = ref<User | null>(null);
const isAuthenticated = ref(false);

// Inicializar o estado a partir do localStorage
function initAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userJson = localStorage.getItem(USER_KEY);
  
  if (token) {
    accessToken.value = token;
    isAuthenticated.value = true;
    
    if (userJson) {
      try {
        currentUser.value = JSON.parse(userJson);
      } catch (e) {
        console.error('Erro ao processar dados do usuário');
      }
    }
    
    // Verificar se o usuário está inativo
    checkUserActivity();
  }
}

// Atualizar o timestamp de última atividade
function updateLastActivity() {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
}

// Login
async function login(email: string, password: string): Promise<boolean> {
  try {
    console.log('Iniciando processo de login...');
    
    // Fazer a chamada à API sem exibir dados sensíveis
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
      throw new Error(`Falha na autenticação: ${response.status} ${response.statusText}`);
    }
    
    // Processar a resposta sem logar dados sensíveis
    const data = await response.json();
    console.log('Dados de autenticação recebidos com sucesso');
    
    // Verificar se os dados estão em um formato esperado
    const authData = Array.isArray(data) ? data[0] : data;
    
    if (!authData || !authData.access_token) {
      console.error('Formato de resposta inválido');
      throw new Error('Formato de resposta inválido');
    }
    
    console.log('Processando dados de autenticação...');
    
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
  accessToken.value = null;
  refreshToken.value = null;
  expiresAt.value = null;
  currentUser.value = null;
  isAuthenticated.value = false;
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  
  console.log('Logout realizado com sucesso');
}

// Verificar e renovar o token antes da expiração
function setupTokenExpirationCheck(expiresIn: number) {
  const refreshTime = expiresIn - (5 * 60 * 1000); // 5 minutos antes da expiração
  
  setTimeout(() => {
    if (isAuthenticated.value) {
      refreshAuthToken();
    }
  }, refreshTime);
}

// Renovar o token de autenticação
async function refreshAuthToken() {
  if (!refreshToken.value) return;
  
  try {
    console.log('Iniciando renovação de token...');
    
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
      console.error('Erro ao renovar o token');
      throw new Error('Falha ao renovar o token');
    }
    
    const data = await response.json();
    console.log('Dados de renovação de token recebidos com sucesso');
    
    const authData = Array.isArray(data) ? data[0] : data;
    
    // Atualizar os dados de autenticação
    accessToken.value = authData.access_token;
    refreshToken.value = authData.refresh_token;
    expiresAt.value = authData.expires_at;
    
    // Atualizar no localStorage
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    
    // Configurar nova verificação
    setupTokenExpirationCheck(authData.expires_in * 1000);
    
    console.log('Token renovado com sucesso');
  } catch (error) {
    console.error('Erro ao renovar o token');
    logout(); // Fazer logout em caso de erro
  }
}

// Monitorar a atividade do usuário
function setupActivityMonitoring() {
  // Atualizar o timestamp de atividade em eventos do usuário
  const events = ['mousedown', 'keydown', 'touchstart', 'click'];
  
  events.forEach(event => {
    window.addEventListener(event, () => {
      if (isAuthenticated.value) {
        updateLastActivity();
      }
    });
  });
  
  // Verificar inatividade periodicamente
  setInterval(() => {
    checkUserActivity();
  }, 60000); // Verificar a cada minuto
}

// Verificar se o usuário está inativo
function checkUserActivity() {
  const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
  
  if (lastActivityStr && isAuthenticated.value) {
    const lastActivity = parseInt(lastActivityStr, 10);
    const now = Date.now();
    
    if (now - lastActivity > INACTIVITY_TIMEOUT) {
      console.log('Sessão expirada por inatividade');
      logout();
    }
  }
}

// Obter o token para requisições autenticadas
function getAuthHeader() {
  if (!accessToken.value) return {};
  
  return {
    'Authorization': `Bearer ${accessToken.value}`
  };
}

// Inicializar a autenticação ao carregar
initAuth();

// Exportar uma versão do objeto que não permite acesso direto aos tokens
export default {
  login,
  logout,
  getAuthHeader,
  updateLastActivity,
  get isAuthenticated() { return isAuthenticated.value; },
  get currentUser() { return currentUser.value; },
  get accessToken() { 
    // Para o dashboard, retornar uma versão mascarada do token
    if (accessToken.value && accessToken.value.length > 20) {
      return `${accessToken.value.substring(0, 10)}...${accessToken.value.substring(accessToken.value.length - 10)}`;
    }
    return accessToken.value; 
  },
  // Método especial para obter o token completo apenas quando necessário
  getFullAccessToken() {
    return accessToken.value;
  }
};
