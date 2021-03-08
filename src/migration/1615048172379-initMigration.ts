import { MigrationInterface, QueryRunner } from "typeorm";

export class eagerRel1615048172379 implements MigrationInterface {
  name = "eagerRel1615048172379";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '"2021-03-06T16:29:32.441Z"', "updated_at" TIMESTAMP NOT NULL DEFAULT '"2021-03-06T16:29:32.441Z"', "deleted" boolean NOT NULL DEFAULT false, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(512), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "upload" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '"2021-03-06T16:29:32.441Z"', "updated_at" TIMESTAMP NOT NULL DEFAULT '"2021-03-06T16:29:32.441Z"', "deleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "path" character varying NOT NULL, "about" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "upload" ADD CONSTRAINT "FK_0acad24db01762fb1d5b51a70cd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "upload" DROP CONSTRAINT "FK_0acad24db01762fb1d5b51a70cd"`
    );
    await queryRunner.query(`DROP TABLE "upload"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
