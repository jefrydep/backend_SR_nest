import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteModule } from './cliente/cliente.module';
import { LoteModule } from './lote/lote.module';
import { VentaModule } from './venta/venta.module';
import { CommonModule } from './common/common.module';
import { CorporationModule } from './corporation/corporation.module';
import { BlockModule } from './block/block.module';
import { ProyectoModule } from './project/proyecto.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,

    ClienteModule,

    LoteModule,

    VentaModule,
    BlockModule,

    ProyectoModule,

    CommonModule,

    CorporationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
