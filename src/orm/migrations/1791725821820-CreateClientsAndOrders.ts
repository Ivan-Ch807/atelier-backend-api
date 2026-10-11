import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClientsAndOrders1791725821820 implements MigrationInterface {
  name = 'CreateClientsAndOrders1791725821820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" SERIAL NOT NULL,
                "description" character varying(255) NOT NULL,
                "price" numeric(10, 2) NOT NULL,
                "status" character varying(30) NOT NULL DEFAULT 'NEW',
                "client_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "clientId" integer,
                CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "clients" (
                "id" SERIAL NOT NULL,
                "full_name" character varying(100) NOT NULL,
                "phone" character varying(20) NOT NULL,
                "email" character varying(100),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_aa22377d7d3e794ae4cd39cd9e5" UNIQUE ("phone"),
                CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_1457f286d91f271313fded23e53" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_1457f286d91f271313fded23e53"
        `);
    await queryRunner.query(`
            DROP TABLE "clients"
        `);
    await queryRunner.query(`
            DROP TABLE "orders"
        `);
  }
}
