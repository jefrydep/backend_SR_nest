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

8. configuramos nuestras entidades con todas sus propiedades como en este caso en el modulo auth importamos nuestro modelo o entidad User (importamos y exportamos)

```js
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([User ])],
   exports:[
    TypeOrmModule
  ]
})

```

9. Creamos la logica de la creacion de usuarios con el Async Await
10. Incriptar la contraseña (instalamos bcrypt)
```
npm i bcrypt
npm i -D @types/bcrypt

```
11. Generamos los tokens para los usuarios instalando estos paquetes
```
 npm i @nestjs/passport passport
 npm i @nestjs/jwt passport-jwt
 npm i -D @types/passport-jwt

```
12. en el authMOdule configuramos nuestro jwt_secret importamos y exportamos el jwt strategy, esto nos sirve para proteger nuestras rutas en base a un bearer token

```js


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    configSevice:ConfigService
){
    super({
        secretOrKey:configSevice.get('JWT_SECRET'),
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        
    });
}

    async validate(payload:JwtPayload):Promise<User>{
        

        const {documentNumber}= payload;
        const user = await this.userRepository.findOneBy({documentNumber});
        if (!user)
        throw new UnauthorizedException('token not valid')

        if(!user.isActive)
        throw new UnauthorizedException('User is inactive, talk with an  admin');

        return user;
    }

}
_____________________________________________
providers: [AuthService,JwtStrategy],
imports: [
  ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };s
      },
    }),
  ],
   exports: [TypeOrmModule,JwtStrategy,PassportModule,JwtModule],
```






