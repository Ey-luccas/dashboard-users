import { createDropdown, setupDropdownToggle, closeAllDropdowns, createBlurOverlay, removeBlurOverlay } from "./userDropdown.js";

function enableEditMode(card, user, onSave) {
  const cardWrapper = card.closest(".user-card-wrapper");
  const userNameElement = card.querySelector(".user-name");
  const userEmailElement = card.querySelector(".user-email");
  const userPhoneElement = card.querySelector(".user-phone");
  
  // Salva valores originais
  const originalName = userNameElement.textContent;
  const originalEmail = userEmailElement.textContent;
  const originalPhone = userPhoneElement.textContent;
  
  // Cria inputs
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "edit-input user-name-input";
  nameInput.value = originalName;
  
  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.className = "edit-input user-email-input";
  emailInput.value = originalEmail;
  
  const phoneInput = document.createElement("input");
  phoneInput.type = "tel";
  phoneInput.className = "edit-input user-phone-input";
  phoneInput.value = originalPhone;
  
  // Marca o card como em modo de edição
  card.setAttribute("data-editing", "true");
  
  // Cria overlay com blur para focar no card em edição
  createBlurOverlay(cardWrapper);
  
  // Aumenta z-index do card para ficar acima do overlay
  if (cardWrapper.style.position !== "relative") {
    cardWrapper.style.position = "relative";
  }
  cardWrapper.style.zIndex = "1000";
  
  // Previne que cliques nos inputs causem perda de foco
  nameInput.addEventListener("click", (e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
  emailInput.addEventListener("click", (e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
  phoneInput.addEventListener("click", (e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
  
  // Substitui elementos por inputs
  userNameElement.replaceWith(nameInput);
  userEmailElement.replaceWith(emailInput);
  userPhoneElement.replaceWith(phoneInput);
  
  // Cria botões de ação (fora do user-contact para ficarem visíveis)
  const actionsContainer = document.createElement("div");
  actionsContainer.className = "edit-actions";
  actionsContainer.innerHTML = `
    <button class="confirm-btn">
      <span class="material-symbols-outlined">check</span>
    </button>
    <button class="cancel-btn">
      <span class="material-symbols-outlined">close</span>
    </button>
  `;
  
  // Adiciona ao card, não ao user-contact, para ficar visível
  card.appendChild(actionsContainer);
  
  // Previne que cliques no card (durante edição) não interfiram com o foco
  const cardClickHandler = (e) => {
    // NÃO previne propagação se clicar nos botões de ação (confirm/cancel)
    // Eles precisam funcionar normalmente
    if (e.target.closest(".confirm-btn") || e.target.closest(".cancel-btn")) {
      return; // Deixa o evento propagar normalmente para os botões funcionarem
    }
    
    // Se clicar em input, previne propagação para manter foco
    if (e.target.closest(".edit-input")) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }
    
    // Qualquer outro clique dentro do card durante edição não faz nada (mantém foco)
    // Isto previne que o dropdown feche e interfira com o foco
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  
  // Usa capture phase com priority para interceptar ANTES do dropdown
  card.addEventListener("click", cardClickHandler, { capture: true, passive: false });
  
  // Função para cancelar
  let outsideClickHandler = null;
  
  const cancelEdit = () => {
    // Remove marcação de modo de edição
    card.removeAttribute("data-editing");
    
    // Remove blur overlay
    removeBlurOverlay();
    
    // Reseta z-index do card wrapper
    cardWrapper.style.zIndex = "";
    
    // Remove listener do card (com as mesmas opções usadas na adição)
    card.removeEventListener("click", cardClickHandler, { capture: true });
    
    // Remove botões de ação primeiro
    const existingActionsContainer = card.querySelector(".edit-actions");
    if (existingActionsContainer) {
      existingActionsContainer.remove();
    }
    
    // Busca os inputs diretamente no DOM para garantir que encontramos
    const currentNameInput = card.querySelector("input.user-name-input") || nameInput;
    const currentEmailInput = card.querySelector("input.user-email-input") || emailInput;
    const currentPhoneInput = card.querySelector("input.user-phone-input") || phoneInput;
    
    // Recria o elemento de nome
    const newNameElement = document.createElement("h2");
    newNameElement.className = "user-name";
    newNameElement.textContent = originalName;
    
    // Recria o elemento de email
    const newEmailElement = document.createElement("p");
    newEmailElement.className = "user-email";
    newEmailElement.textContent = originalEmail;
    
    // Recria o elemento de telefone
    const newPhoneElement = document.createElement("p");
    newPhoneElement.className = "user-phone";
    newPhoneElement.textContent = originalPhone;
    
    // Substitui inputs pelos elementos originais
    if (currentNameInput && currentNameInput.parentNode) {
      currentNameInput.replaceWith(newNameElement);
    }
    
    if (currentEmailInput && currentEmailInput.parentNode) {
      currentEmailInput.replaceWith(newEmailElement);
    }
    
    if (currentPhoneInput && currentPhoneInput.parentNode) {
      currentPhoneInput.replaceWith(newPhoneElement);
    }
    
    // Remove listener de clique fora
    if (outsideClickHandler) {
      document.removeEventListener("click", outsideClickHandler);
      outsideClickHandler = null;
    }
  };
  
  // Função para salvar
  const saveEdit = () => {
    const newName = nameInput.value.trim();
    const newEmail = emailInput.value.trim();
    const newPhone = phoneInput.value.trim();
    
    // Remove marcação de modo de edição
    card.removeAttribute("data-editing");
    
    // Remove blur overlay
    removeBlurOverlay();
    
    // Reseta z-index do card wrapper
    cardWrapper.style.zIndex = "";
    
    // Remove listener do card
    card.removeEventListener("click", cardClickHandler, { capture: true });
    
    // Remove listener antes de salvar
    if (outsideClickHandler) {
      document.removeEventListener("click", outsideClickHandler);
      outsideClickHandler = null;
    }
    
    if (newName && newEmail && newPhone) {
      onSave({
        username: user.username,
        name: newName,
        email: newEmail,
        phone: newPhone
      });
    } else {
      alert("Todos os campos são obrigatórios!");
    }
  };
  
  // Event listeners
  actionsContainer.querySelector(".confirm-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    saveEdit();
  });
  
  const cancelButton = actionsContainer.querySelector(".cancel-btn");
  
  // Listener no botão (o evento propaga do span para o button, então funciona)
  cancelButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    // Remove o listener de clique fora antes para evitar chamadas duplicadas
    if (outsideClickHandler) {
      document.removeEventListener("click", outsideClickHandler);
      outsideClickHandler = null;
    }
    cancelEdit();
  });
  
  // Listener para cancelar ao clicar fora do card
  outsideClickHandler = (e) => {
    // Só cancela se clicar FORA do card wrapper completamente
    if (cardWrapper && !cardWrapper.contains(e.target)) {
      cancelEdit();
    }
  };
  
  // Adiciona listener após um pequeno delay para não cancelar imediatamente
  setTimeout(() => {
    document.addEventListener("click", outsideClickHandler);
  }, 100);
  
  // Foca no primeiro input
  nameInput.focus();
  nameInput.select();
}

function renderUsers(users, { onEdit, onDelete }) {
    const container = document.querySelector(".users-container");
  
    // limpa antes de renderizar
    container.innerHTML = "";
  
    // se não tiver usuários
    if (users.length === 0) {
      container.innerHTML = "<p>Nenhum usuário encontrado</p>";
      return;
    }
  
    users.forEach(user => {
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "user-card-wrapper";
      
      const card = document.createElement("div");
      card.className = "user-card";
  
      // Primeira letra do nome para o avatar
      const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";
      
      card.innerHTML = `
        <div class="user-avatar">${initial}</div>
        <div class="user-info">
          <h2 class="user-name">${user.name}</h2>
          <p class="user-username">@${user.username}</p>
        </div>
        <div class="user-contact">
          <p class="user-email">${user.email}</p>
          <p class="user-phone">${user.phone || 'Não informado'}</p>
        </div>
      `;
      
      // Cria o dropdown usando a função do userDropdown.js
      const dropdown = createDropdown(user, (user) => {
        // Fecha todos os dropdowns
        closeAllDropdowns();
        // Imediatamente após, ativa modo de edição que recria o blur
        // Usar setTimeout mínimo para garantir que enableEditMode execute após closeAllDropdowns
        setTimeout(() => {
          enableEditMode(card, user, onEdit);
        }, 0);
      }, onDelete);
      
      cardWrapper.appendChild(card);
      cardWrapper.appendChild(dropdown);
      container.appendChild(cardWrapper);
      
      // Configura o toggle do dropdown
      setupDropdownToggle(cardWrapper, dropdown);
      
      // Duplo clique no card: fecha dropdown e ativa modo de edição
      card.addEventListener("dblclick", (e) => {
        // Não faz nada se estiver em modo de edição
        if (card.getAttribute("data-editing") === "true") {
          return;
        }
        
        // Fecha dropdown se estiver aberto
        closeAllDropdowns();
        
        // Ativa modo de edição
        enableEditMode(card, user, onEdit);
      });
    });
  }
  
  export { renderUsers, enableEditMode };
  