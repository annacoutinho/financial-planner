# Imagem base
FROM node:20

# Criar diretório da aplicação
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o restante do código
COPY . .

# Build do código
RUN npm run build

# Expor porta da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "start:prod"]
