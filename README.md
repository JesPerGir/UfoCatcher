# 🛸 UfoCatcher - Videojuego Web Arcade

## 1. Descripción del Proyecto
**UfoCatcher** es un videojuego web *Full Stack* de supervivencia y recolección de estilo arcade. Controla un OVNI, esquiva asteroides, recoge orbes de energía y compite por el primer puesto en el ranking global. 

Este proyecto integra un motor de físicas de videojuegos (Phaser 3) directamente en el ecosistema de una Single Page Application (React), respaldado por una API RESTful (Node/Express) y una base de datos NoSQL (MongoDB).

## 2. Tecnologías Utilizadas
* **Frontend:** React, Vite, Phaser 3, Tailwind CSS.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** MongoDB, Mongoose.
* **Seguridad:** JSON Web Tokens (JWT).

## 3. Requisitos Previos
Para poder levantar este proyecto en un entorno local, es necesario disponer de:
* **Node.js** (v16 o superior) instalado en el sistema.
* **Git** instalado para clonar el repositorio.
* Una cuenta activa en **MongoDB Atlas** (o una instancia local) con tu propia URI de conexión.

## 4. Instalación y Configuración
A continuación, se detallan los pasos exactos para levantar tanto el servidor como el cliente de forma local.

### 4.1. Clonar el repositorio
Abre una terminal y ejecuta el siguiente comando:
```bash
git clone https://github.com/JesPerGir/UfoCatcher.git
cd UfoCatcher

### 4.2. Configurar el Backend (Servidor)
Navega a la carpeta del servidor e instala sus dependencias:
cd server
npm install

Crea un archivo llamado .env en la raíz de la carpeta server y añade las siguientes variables de entorno:
PORT=3000
MONGO_URI=mongodb+srv://<TU_USUARIO>:<TU_PASSWORD>@cluster.mongodb.net/ufocatcher?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_super_segura
(Reemplaza los campos <TU_USUARIO> y <TU_PASSWORD> de MongoDB con tus credenciales reales).

Inicia el servidor en modo desarrollo:
npm run dev

### 4.3. Configurar el Frontend (Cliente)
Abre una nueva terminal (sin cerrar la del servidor) y navega a la carpeta del cliente:
cd client
npm install

Inicia la aplicación de React:
npm run dev
(La aplicación cliente se abrirá en tu navegador, generalmente en http://localhost:5173).

### 5. Autor
Jesús Pérez Giráldez - Proyecto Final de 2º Desarrollo de Aplicaciones Web (DAW).

#Agradecimientos especiales a los autores de los assets gratuitos utilizados:

###Celestial Objects Pixel Art
###Twitter - https://twitter.com/norma_2d
###DeviantArt - https://www.deviantart.com/norma2d
###https://uselesspursuit.itch.io/celestial-objects-pixel-art-pack?download

###Seamless Space Backgounds
###https://screamingbrainstudios.itch.io/seamless-space-backgrounds

###Free Bullet Hell Mini Music Pack
###https://shononoki.itch.io/bullet-hell-music-pack

###8-bit / 16-bit Sound Effects (x25) Pack
###Twitter - https://x.com/JDWasabi
###https://jdwasabi.itch.io/8-bit-16-bit-sound-effects-pack

###Daily Doodles Pixel Art Asset Pack #1
###Twitter - https://x.com/zsoka75
###https://raventale.itch.io/daily-doodles-pixelart-asset-pack
