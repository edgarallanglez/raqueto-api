import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251126181614 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "brand" add column if not exists "is_active" boolean not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "brand" drop column if exists "is_active";`);
  }

}
