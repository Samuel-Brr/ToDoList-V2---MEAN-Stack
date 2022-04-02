# Pour faire fonctionner le projet:

## Dans un premier terminale dans le dossier frontend lancer:

npm install

ng serve -o

## Dans un second terminale dans le dossier backend lancer:

npm install

connectez vous à une base de données mongoDb dans un fichier .env (à la racine du backend) format:
DB_STRING='mongodb+srv://<<id:password>>@cluster0.jt4fy.mongodb.net/<>Database-name<>?retryWrites=true&w=majority'
SECRET="random-very-long-string"

nodemon.app.js 

