function renderUsers(users) {
    const container = document.querySelector(".users-container");
  
    // limpa antes de renderizar
    container.innerHTML = "";
  
    // se não tiver usuários
    if (users.length === 0) {
      container.innerHTML = "<p>Nenhum usuário encontrado</p>";
      return;
    }
  
    users.forEach(user => {
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
  
      container.appendChild(card);
    });
  }
  
  export { renderUsers };
  