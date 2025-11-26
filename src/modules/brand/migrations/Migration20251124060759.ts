import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251124060759 extends Migration {

  override async up(): Promise<void> {
    // Drop existing tables if they exist
    this.addSql(`drop table if exists "product_product_brandmodule_brand" cascade;`);
    this.addSql(`drop table if exists "brand" cascade;`);
    
    // Create brand table with slug column
    this.addSql(`create table "brand" ("id" text not null, "name" text not null, "slug" text not null, "description" text null, "logo_url" text null, "website_url" text null, "sports" jsonb null, "country" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "brand_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_brand_deleted_at" ON "brand" ("deleted_at") WHERE deleted_at IS NULL;`);
    
    // Recreate link table
    this.addSql(`create table "product_product_brandmodule_brand" ("id" text not null, "product_id" text not null, "brand_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_product_brandmodule_brand_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "brand" cascade;`);
  }

}
