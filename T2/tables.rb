require 'active_record'

# Definição das tabelas
class Pessoa < ActiveRecord::Base
  has_many :telefones, dependent: :destroy
  has_many :inscricoes, dependent: :destroy, class_name: 'Inscricao'
  has_many :cursos, through: :inscricoes
end

class Telefone < ActiveRecord::Base
  belongs_to :pessoa
end

class Curso < ActiveRecord::Base
  has_many :inscricoes, dependent: :destroy, class_name: 'Inscricao'
  has_many :pessoas, through: :inscricoes
end

class Inscricao < ActiveRecord::Base
  self.table_name = 'inscricoes'
  belongs_to :pessoa
  belongs_to :curso
end
