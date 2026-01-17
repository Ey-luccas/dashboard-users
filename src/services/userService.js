export async function fetchUsers() {
try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (response.status !== 200) {
        throw new Error("Erro ao buscar usuários");
      }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
} 