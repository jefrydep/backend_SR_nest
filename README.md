# comands
1. comando para crear una nueva aplicacion 

```
nest new app_san_roman
```
2. paquetes necesarios
```
  npm i class-validator
  npm i class-transformer
```
3. generamos un nuevo recurso
```
nest g res  auth
```
4. configaroms api
```js
 app.setGlobalPrefix('api/')
```
5. creamos un archivo docker-compose.yml y creamos nuestor file env

```js
version: '3'


services:
  db:
    image: postgres:14.3
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME} 
    container_name: jefry
    volumes:
      - ./postgres:/var/lib/postgresql/data

```
6. conectar postgres con nest
- instalamos algulnos paquetes y configuramos el env


```
 npm i @nestjs/config

```
- importamos el configure module para que reconosca las env
```js
 imports: [ConfigModule.forRoot(), AuthModule],
```
7. instalamos el driver de postgress
```
npm i @nestjs/typeorm typeorm pg
```
```js
 TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize:true,
// el synchronize  en produccion ponemos en false

    }),

```
```js
DB_PASSWORD=MYPASSWORD
DB_NAME=SANROMAN
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
```
