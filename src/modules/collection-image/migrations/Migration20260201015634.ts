import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260201015634 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "collection_image" drop constraint if exists "collection_image_collection_id_type_unique";`);
    this.addSql(`create table if not exists "collection_image" ("id" text not null, "url" text not null, "file_id" text not null, "type" text check ("type" in ('thumbnail', 'banner')) not null, "collection_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "collection_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_collection_image_deleted_at" ON "collection_image" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_collection_image_collection_id_type_unique" ON "collection_image" ("collection_id", "type") WHERE type = 'thumbnail' AND deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "collection_image" cascade;`);
  }

}
