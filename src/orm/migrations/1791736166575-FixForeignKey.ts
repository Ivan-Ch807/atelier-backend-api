import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixForeignKey1791736166575 implements MigrationInterface {
  name = 'FixForeignKey1791736166575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "client_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_1457f286d91f271313fded23e53"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ALTER COLUMN "clientId"
            SET NOT NULL
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
            ALTER TABLE "orders"
            ALTER COLUMN "clientId" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_1457f286d91f271313fded23e53" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "client_id" integer NOT NULL
        `);
  }
}
