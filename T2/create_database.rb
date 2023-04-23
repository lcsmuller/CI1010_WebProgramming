require './tables.rb'

=begin
(a) Um para muitos: A tabela "pessoas" pode ter uma ou muitas linhas associadas
    na tabela "telefones"
(a) Um para muitos: A tabela "cursos" pode ter  muitas linhas associadas na
    tabela "inscricoes", e cada linha na tabela "inscricoes" pode estar
    associada a uma única linha na tabela "cursos"
(b) A tabela "inscricoes" pode ter uma relação de muitos para um com a tabela
    "pessoas"
(c) A tabela "pessoas" pode estar associada a muitas linhas na tabela "cursos"
    por meio da tabela intermediária "inscricoes", e cada linha na tabela "cursos"
    também pode estar associada a muitas linhas na tabela "pessoas" por medio da
    tabela intermediária "inscrições"
=end

ActiveRecord::Base.establish_connection(
  adapter: 'sqlite3',
  database: 'database.sqlite3'
)

ActiveRecord::Schema.define do
  create_table :pessoas do |t|
    t.string :last_name
    t.string :first_name
    t.string :address
    t.string :city
    t.timestamps null: false
  end

  create_table :telefones do |t|
    t.string :numero
    t.references :pessoa
    t.timestamps null: false
  end

  create_table :cursos do |t|
    t.string :nome
    t.timestamps null: false
  end

  create_table :inscricoes do |t|
    t.references :pessoa
    t.references :curso
    t.timestamps null: false
  end
end

# Popula tabelas
## Tabela de pessoas
pessoas = [
  Pessoa.create(first_name: 'Alex', last_name: 'Smith', address: '123 Main St', city: 'Anytown'),
  Pessoa.create(first_name: 'Bianca', last_name: 'Smith', address: '123 Main St', city: 'Anytown'),
  Pessoa.create(first_name: 'Johnatan', last_name: 'Jones', address: '127 Side St', city: 'Nowhereland'),
  Pessoa.create(first_name: 'Stephanie', last_name: 'Jones', address: '127 Side St', city: 'Nowhereland'),
];
## Tabela de telefones
telefones = [
  Telefone.create(numero: '1234-5678', pessoa: pessoas[0]),
  Telefone.create(numero: '1234-5678', pessoa: pessoas[1]),
  Telefone.create(numero: '555-1234', pessoa: pessoas[2]),
  Telefone.create(numero: '555-1234', pessoa: pessoas[3]),
];
## Tabela de cursos
cursos = [Curso.create(nome: 'BCC'), Curso.create(nome: 'IBM'), Curso.create(nome: 'MED')];
## Tabela de inscrições
inscricoes = [
  Inscricao.create(pessoa: pessoas[0], curso: cursos[1]),
  Inscricao.create(pessoa: pessoas[1], curso: cursos[1]),
  Inscricao.create(pessoa: pessoas[2], curso: cursos[0]),
  Inscricao.create(pessoa: pessoas[3], curso: cursos[2]),
];
