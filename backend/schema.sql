INSERT INTO profissionais (nome, telefone, email, senha_hash, ativo, id_role)
VALUES (
  'Administrador',
  '(11) 99999-9999',
  'admin@banhoetosa.com',
  crypt('admin123', gen_salt('bf')), -- agora funciona
  TRUE,
  (SELECT id_role FROM roles WHERE nome = 'profissional')
);
