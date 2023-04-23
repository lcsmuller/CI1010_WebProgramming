## Iniciando

1. Instale as dependências:
  ```sh
    bundle install
   ```
2. Crie a DB (as tabelas deverão ser automaticamente populadas):
  ```sh
    ruby create_database.rb
  ```

## Referência

### Tabelas

| Tabela      | Atributos                            |
|-------------|--------------------------------------|
| pessoa      | first_name, last_name, address, city |
| telefone    | numero, pessoa_id                    |
| curso       | nome                                 |
| inscricao   | pessoa_id, curso_id                  |

### Comandos

- **Insere:** `ruby app.rb inclusao <tabela> <atributo1=valor1> <atributo2=valor2> <...>`
  - **Exemplo:** `ruby app.rb inclusao pessoa first_name=Alex last_name=Smith address='123 Main St' city=Anytown`
- **Alteração:** `ruby app.rb alteracao <tabela> <atributo1=valor1> <atributo2=valor2> <...>`
  - **Exemplo:** `ruby app.rb alteracao pessoa id=1 first_name=John last_name=Richards address='123 Main St'`
- **Exclusão:** `ruby app.rb exclusao <tabela> <id=valor_id>`
  - **Exemplo:** `ruby app.rb exclusao pessoa id=1` 
- **Lista:** `ruby app.rb lista <tabela>`
  - **Exemplo:** `ruby app.rb lista pessoa`
