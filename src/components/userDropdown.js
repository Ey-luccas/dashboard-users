function createDropdown(user, onEdit, onDelete) {
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown-container";
  dropdown.style.display = "none";
  
  dropdown.innerHTML = `
    <div class="update-user-container">
      <button class="dropdown-button" data-action="edit">
        <span class="material-symbols-outlined">edit</span>
      </button>
    </div>
    <div class="delete-user-container">
      <button class="dropdown-button" data-action="delete">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
  `;

  // Event listeners para os botões
  const editButton = dropdown.querySelector('[data-action="edit"]');
  const deleteButton = dropdown.querySelector('[data-action="delete"]');

  if (editButton && onEdit) {
    editButton.addEventListener("click", (e) => {
      e.stopPropagation();
      onEdit(user);
      hideDropdown(dropdown);
    });
  }

  if (deleteButton && onDelete) {
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      onDelete(user);
      hideDropdown(dropdown);
    });
  }

  return dropdown;
}

function toggleDropdown(dropdown, cardWrapper) {
  const isVisible = dropdown.style.display === "flex";
  
  // Fecha todos os outros dropdowns
  closeAllDropdowns();
  
  if (isVisible) {
    hideDropdown(dropdown);
  } else {
    showDropdown(dropdown, cardWrapper);
  }
}

function createBlurOverlay(cardWrapper) {
  let overlay = document.getElementById("dropdown-blur-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "dropdown-blur-overlay";
    overlay.className = "dropdown-blur-overlay";
    
    // Fecha dropdown ao clicar no overlay
    overlay.addEventListener("click", () => {
      closeAllDropdowns();
    });
    
    document.body.appendChild(overlay);
  }
  overlay.style.display = "block";
  return overlay;
}

function removeBlurOverlay() {
  const overlay = document.getElementById("dropdown-blur-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

function showDropdown(dropdown, cardWrapper) {
  // Ajusta a posição primeiro para calcular dimensões corretas
  adjustDropdownPosition(dropdown, cardWrapper);
  
  dropdown.style.display = "flex";
  
  // Cria overlay com blur
  createBlurOverlay(cardWrapper);
  
  // Aumenta z-index do card e dropdown para ficarem acima do overlay
  if (cardWrapper.style.position !== "relative") {
    cardWrapper.style.position = "relative";
  }
  cardWrapper.style.zIndex = "1000";
  dropdown.style.zIndex = "1001";
}

function hideDropdown(dropdown) {
  dropdown.style.display = "none";
  dropdown.classList.remove("dropdown-left");
  dropdown.style.right = "";
  dropdown.style.left = "";
  
  // Remove blur overlay
  removeBlurOverlay();
  
  // Reseta z-index do card wrapper
  const cardWrapper = dropdown.closest(".user-card-wrapper");
  if (cardWrapper) {
    cardWrapper.style.zIndex = "";
  }
}

function adjustDropdownPosition(dropdown, cardWrapper) {
  const card = cardWrapper.querySelector(".user-card");
  const rect = card.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  
  // Calcula posição à direita
  const rightPosition = rect.right + 120;
  
  // Se sair pela direita, inverte para a esquerda
  if (rightPosition > windowWidth) {
    dropdown.classList.add("dropdown-left");
    dropdown.style.right = "auto";
    dropdown.style.left = "-181px";
    dropdown.style.backgroundColor = '#fff'
    dropdown.style.borderRadius = "20px 0px 0px 20px";
  } else {
    dropdown.classList.remove("dropdown-left");
    dropdown.style.right = "-181px";
    dropdown.style.left = "auto";
    dropdown.style.borderRadius = "0px 20px 20px 0px";
  }
}

function closeAllDropdowns() {
  const allDropdowns = document.querySelectorAll(".dropdown-container");
  allDropdowns.forEach(dropdown => {
    hideDropdown(dropdown);
  });
  // Garante que o overlay é removido
  removeBlurOverlay();
}

function setupDropdownToggle(cardWrapper, dropdown) {
  const card = cardWrapper.querySelector(".user-card");
  
  // Clique no card para abrir/fechar dropdown
  // Usa bubble phase (padrão) para ser executado DEPOIS do cardClickHandler (capture)
  card.addEventListener("click", (e) => {
    // Não faz nada se estiver em modo de edição - previne toggle do dropdown
    if (card.getAttribute("data-editing") === "true") {
      e.stopPropagation();
      return;
    }
    
    // Não fecha se clicar nos botões do dropdown
    if (!e.target.closest(".dropdown-container")) {
      toggleDropdown(dropdown, cardWrapper);
    }
  }, { capture: false }); // Bubble phase (padrão)
}

export { createDropdown, setupDropdownToggle, closeAllDropdowns, createBlurOverlay, removeBlurOverlay };
