import { fetchUsers } from "./services/userService.js";
import { setUsers, getUsers, updateUser, deleteUser} from "./data/store.js";
import { renderUsers } from "./components/userList.js";

function handleEdit(userData) {
  try {
    updateUser(userData);
    renderUsers(getUsers(), { onEdit: handleEdit, onDelete: handleDelete });
  } catch (error) {
    alert(error.message);
  }
}

function handleDelete(user) {
  deleteUser(user.username);
  renderUsers(getUsers(), { onEdit: handleEdit, onDelete: handleDelete });
}

async function initApp() {
  const users = await fetchUsers();
  setUsers(users);
  
  // Renderiza os usuários na tela
  renderUsers(getUsers(), { onEdit: handleEdit, onDelete: handleDelete });
}

initApp();