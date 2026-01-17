import { fetchUsers } from "./services/userService.js";
import { setUsers, getUsers , addUser, updateUser, deleteUser} from "./data/store.js";
import { renderUsers } from "./components/userList.js";

function handleDelete(username) {
  deleteUser(username);
  renderUsers(getUsers(), { onDelete: handleDelete });
}

async function initApp() {
  const users = await fetchUsers();
  setUsers(users);
  
  // Renderiza os usuários na tela
  renderUsers(getUsers(), { onDelete: handleDelete });
}

initApp();