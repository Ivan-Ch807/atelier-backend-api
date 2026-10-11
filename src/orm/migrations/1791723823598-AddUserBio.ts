import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserBio1791723823598 implements MigrationInterface {
  name = 'AddUserBio1791723823598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "bio" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "bio"
        `);
  }
}
