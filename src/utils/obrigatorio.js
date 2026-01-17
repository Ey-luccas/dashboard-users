function obrigatorio(nomeParametro) {
  throw new Error(`${nomeParametro} é um parâmetro obrigatório.`);
}
export default obrigatorio;