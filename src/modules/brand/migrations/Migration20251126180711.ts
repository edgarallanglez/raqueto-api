import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251126180711 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "brand" add column if not exists "order" integer null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "brand" drop column if exists "order";`);
  }

}
