<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Lado esquerdo - Formulário -->
      <div class="w-full md:w-1/2 p-8 md:p-12">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Acesse sua conta</h1>
          <p class="mt-2 text-gray-600">Entre com seus dados para acessar o sistema Destack Terapias</p>
        </div>
        
        <!-- Botão Google -->
        <button class="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 mb-4">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5 mr-2">
          <span>Continuar com Google</span>
        </button>
        
        <!-- Separador -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">ou entre com email</span>
          </div>
        </div>
        
        <!-- Formulário -->
        <form class="space-y-4" @submit="handleLogin">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" name="email" type="email" autocomplete="email" required 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destack-pink focus:border-destack-pink" 
                   placeholder="seu@email.com"
                   v-model="email">
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destack-pink focus:border-destack-pink" 
                   placeholder="••••••"
                   v-model="password">
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" 
                     class="h-4 w-4 text-destack-pink focus:ring-destack-pink border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>
            
            <div class="text-sm">
              <a href="#" class="font-medium text-destack-pink hover:text-destack-pink/80">
                Esqueceu a senha?
              </a>
            </div>
          </div>
          
          <div>
            <button type="submit" 
                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-destack-pink hover:bg-destack-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destack-pink"
                    :disabled="loading">
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Processando...' : 'Entrar' }}
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center text-sm">
          <p class="text-gray-600">
            Não tem uma conta? 
            <a href="#" class="font-medium text-destack-pink hover:text-destack-pink/80">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
      
      <!-- Lado direito - Imagem/Ilustração -->
      <div class="hidden md:block w-1/2 bg-destack-pink relative overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center p-8">
          <div class="relative w-full max-w-lg">
            <!-- Elementos decorativos -->
            <div class="absolute top-0 -right-4 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div class="absolute top-0 -left-4 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div class="absolute -bottom-8 left-20 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            
            <!-- Conteúdo -->
            <div class="relative">
              <!-- Logo -->
              <div class="mb-8 flex justify-center">
                <div class="text-white text-3xl font-bold">Destack Terapias</div>
              </div>
              
              <!-- Estatísticas -->
              <div class="space-y-4">
                <div class="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
                  <div class="text-white text-sm mb-1">Sessões realizadas</div>
                  <div class="text-white text-2xl font-bold">120.435</div>
                </div>
                
                <div class="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
                  <div class="text-white text-sm mb-1">Clientes satisfeitos</div>
                  <div class="text-white text-2xl font-bold">62.746</div>
                </div>
                
                <div class="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
                  <div class="text-white text-sm mb-1">Avaliação média</div>
                  <div class="flex items-center">
                    <div class="text-white text-2xl font-bold mr-2">4.8</div>
                    <div class="flex text-yellow-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Verificar se o usuário já está autenticado
onMounted(() => {
  if (authService.isAuthenticated.value) {
    router.push('/');
  }
});

async function handleLogin(e: Event) {
  e.preventDefault()
  
  if (!email.value || !password.value) {
    error.value = 'Por favor, preencha todos os campos';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const success = await authService.login(email.value, password.value);
    
    if (success) {
      console.log('Login realizado com sucesso!');
      router.push('/dashboard');
    } else {
      error.value = 'Credenciais inválidas. Verifique seu email e senha.';
    }
  } catch (err) {
    console.error('Erro na requisição:', err);
    error.value = 'Erro de conexão. Verifique sua internet e tente novamente.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.animate-blob {
  animation: blob-bounce 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob-bounce {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
</style>
