require './tables.rb'

# Conexão com o banco de dados (no caso, SQLite3)
ActiveRecord::Base.establish_connection(
  adapter: 'sqlite3',
  database: 'database.sqlite3'
)

# Realizar operações de inclusão, alteração, exclusão e lista
comando, nome_tabela, *atributos = ARGV

tabela = {}
begin
  tabela = nome_tabela.capitalize.constantize
rescue NameError
  STDERR.puts "Tabela '#{nome_tabela.capitalize}' não encontrada!"
  return
end

case comando.downcase
when "inclusao"
  novo_registro = tabela.new
  atributos.each do |atributo|
    chave, valor = atributo.split("=")
    novo_registro[chave] = valor
  end
  novo_registro.save
when "alteracao"
  id = atributos.shift.split("=").last
  registro = tabela.find_by(id: id)
  if registro.nil?
    STDERR.puts "Registro não encontrado!"
    return
  end
  atributos.each do |atributo|
    chave, valor = atributo.split("=")
    registro[chave] = valor
  end
  registro.save
when "exclusao"
  id = atributos.shift.split("=").last
  registro = tabela.find_by(id: id)
  if registro.nil?
    STDERR.puts "Registro não encontrado!"
    return
  end
  registro.destroy
when "lista"
  registros = tabela.all
  registros.each do |registro|
    puts registro.inspect
  end
else
  STDERR.puts "Comando '#{comando}' não reconhecido!"
end