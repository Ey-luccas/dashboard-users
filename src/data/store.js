import obrigatorio from "../utils/obrigatorio.js";
let users = []; // privado ao módulo

function setUsers(newUsers) {
  const ajustedUsers = newUsers.map(user => { 
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
    }
  })
  users = ajustedUsers;
}

function getUsers() {
  return [...users];
}

function addUser(newUser) { 
  if (!newUser.name || !newUser.username || !newUser.email || !newUser.phone) {
    throw new Error("Usuário inválido");
  }
  if (users.some(user => user.username === newUser.username)) {
    throw new Error("Usuário já existe");
  }
  newUser.id = Math.max(0, ...users.map(u => u.id)) + 1; //AUTOINCREMENTO DE ID
  users.push(newUser);
}
function updateUser(userData = obrigatorio('userData')) {
  const existingUser = users.find(
    user => user.username === userData.username
  );

  if (!existingUser) {
    throw new Error("Usuário não encontrado");
  }

  Object.assign(existingUser, {
    name: userData.name ?? existingUser.name,
    email: userData.email ?? existingUser.email,
    phone: userData.phone ?? existingUser.phone
  });

  return existingUser;
}

function deleteUser(username) {
  const existingUser = users.find(user => user.username === username);
  if (!existingUser) {
    throw new Error("Usuário não encontrado");
  }
  users = users.filter(user => user.username !== username);
}
export { setUsers, getUsers , addUser, updateUser, deleteUser };
