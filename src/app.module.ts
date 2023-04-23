import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteModule } from './cliente/cliente.module';
import { LoteModule } from './lote/lote.module';
import { VentaModule } from './venta/venta.module';
import { ManzanaModule } from './manzana/manzana.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { CommonModule } from './common/common.module';

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

    ManzanaModule,

    ProyectoModule,

    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
