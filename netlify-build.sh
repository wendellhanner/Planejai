#!/bin/bash

# Script de build personalizado para o Netlify

# Instalar dependências
echo "Instalando dependências..."
npm install

# Verificar se o Prisma é realmente necessário
if grep -q "from '@prisma/client'" $(find ./src -type f -name "*.ts" -o -name "*.tsx" | xargs) 2>/dev/null; then
  echo "Prisma está sendo usado no código, gerando cliente..."
  npx prisma generate
else
  echo "Prisma não está sendo usado ativamente, pulando geração do cliente..."
  # Criar um diretório vazio para o Prisma Client para evitar erros
  mkdir -p node_modules/.prisma/client
  echo '{}' > node_modules/.prisma/client/index.js
  echo 'export default {}' > node_modules/.prisma/client/index.d.ts
fi

# Executar o build do Next.js com a configuração específica para o Netlify
echo "Executando build do Next.js com configuração para o Netlify..."
cp next.config.netlify.js next.config.js
NEXTJS_IGNORE_ESLINT=1 NETLIFY=true npm run build
