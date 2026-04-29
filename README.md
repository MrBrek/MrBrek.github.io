# Social Network 📱
<img width="100%" src="https://github.com/pedropleite/Social_Network/blob/main/READMEGif.gif">
<br>

## 🔍 Sobre o Projeto

📌 **Deploy:** <a href="https://social-networkp.netlify.app" target="_blank">https://social-networkp.netlify.app/</a>

A **Social Network** é uma aplicação web que simula uma rede social moderna, desenvolvida com foco em **boas práticas**, **modularidade** e **experiência do usuário**.

Construída com **React**, **TypeScript** e **Firebase**, oferece autenticação de usuários, CRUD completo de posts (com upload de imagens), pesquisa por tags, tema escuro/claro com persistência de preferência, tudo isso em uma interface **responsiva** e de **fácil manutenção**.

Além do CRUD, o projeto segue conceitos de **arquitetura em camadas**, **componentização reutilizável**, **tipagem forte** e **organização de código** para garantir **escalabilidade**, **performance** e **clareza para colaboradores**.

---

## ✨ Funcionalidades Principais
A aplicação possui recursos fundamentais para simular uma rede social real, com uma base sólida de código limpo e modular:

### 🔐 Autenticação
- **Login e registro de usuários** com Firebase Auth.
- **Validação de formulários** usando React Hook Form.
- **Mensagens de erro claras** para uma boa UX.
- **Persistência de sessão** para manter o usuário logado.

### 📝 Posts
- **CRUD completo de posts**, com texto e imagem.
- **Dashboard pessoal** para edição e exclusão de posts.
- **Feed cronológico**, do mais recente ao mais antigo.
- **Pesquisa por tags**, com filtragem em tempo real.

### 🎨 Interface
- **Tema dark/light**, com troca fluida e armazenamento de preferência.
- **Layout responsivo**, adaptado para desktop, tablet e mobile.
- **Estilização com SCSS Modules**, garantindo modularidade e reaproveitamento.

---

## 🛠 Organização do Desenvolvimento

Esta seção funciona como uma **mini árvore Git** para mostrar a progressão real do projeto, destacando a motivação de cada etapa e suas mudanças principais. Assim, qualquer colaborador ou recrutador entende **como o projeto evoluiu**.

<details>
<summary><strong>🌱 Versão inicial do projeto</strong></summary>

**Contexto:** Primeira versão criada para validar o CRUD básico e o fluxo de autenticação.

**Branch:** Nenhuma branch de release específica — desenvolvimento inicial direto na `main`.

**Principais pontos:**
- Estruturação do CRUD com ReactJS.
- Uso de **Firebase** para autenticação e armazenamento de posts.
- Estilização com **Styled Components**.
- Implementação do tema dark/light com persistência.
</details>

<details>
<summary><strong>🌿 Release 2.0.0 (branch ativa)</strong></summary>

**Contexto:** Refatoração ampla do projeto, tornando-o mais modular, tipado e alinhado com boas práticas para crescer de forma escalável.

**Branch:** `release/2.0.0`

**Principais melhorias:**
- ✅ **Migração completa para TypeScript** para garantir tipagem forte e segurança em toda a base de código.
- ✅ **Adoção do React Hook Form** em todos os formulários (cadastro, login, criação, edição e exclusão de posts), melhorando validações e usabilidade.
- ✅ **Substituição de Styled Components por SCSS Modules**, tornando a estilização mais modular e organizada.
- ✅ **Refatoração geral de componentes e funções**, deixando o projeto dividido em camadas (hooks, contextos, componentes compartilhados, páginas).
- ✅ Organização do código para facilitar a manutenção e colaboração futura.
</details>

---

## 📅 Roadmap futuro

<details>
<summary><strong>✨ Interações sociais</strong></summary>

Objetivo: Implementar mecanismos de engajamento entre usuários para tornar a rede social mais interativa e dinâmica.

- [ ] **Sistema de likes**  
   → Botão de like com persistência no Firebase e animação de feedback

- [ ] **Comentários em posts**  
   → Threads de comentários com nested replies e markdown básico
</details>

<details>
<summary><strong>🖼 Perfil do usuário</strong></summary>

Objetivo: Oferecer maior personalização e controle aos usuários sobre sua identidade na plataforma.

- [ ] **Upload de foto de perfil**  
   → Integração com Firebase Storage para upload e crop de imagens

- [ ] **Página de perfil personalizável**  
   → Bio, links sociais e highlights de posts marcados

</details>

<details>
<summary><strong>⚙ Melhorias técnicas</strong></summary>

Objetivo: Aprimorar a base de código para garantir escalabilidade, manutenibilidade e performance.

- [ ] **Migração para Redux Toolkit**  
   → Substituição gradual do Context API para gestão de estado global

- [ ] **Testes unitários**  
   → Cobertura com Jest + Testing Library para componentes críticos
</details>

<br/>

## 💻 Tecnologias Utilizadas

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS Modules">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form">
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router">
  <img src="https://img.shields.io/badge/Context_API-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="Context API">
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">
</div>


<br/>
