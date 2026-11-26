# Usa imagem oficial do Node.js baseada em Alpine Linux para ser leve e rápida
FROM node:20-alpine

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia manifestos de dependências primeiro para aproveitar o cache de camadas do Docker
COPY package*.json ./

# Instala as dependências de produção
RUN npm ci --only=production || npm install --production

# Copia todo o código-fonte da aplicação
COPY . .

# Expõe a porta padrão configurada na aplicação
EXPOSE 3333

# Comando para iniciar o servidor
CMD ["node", "app.js"]
