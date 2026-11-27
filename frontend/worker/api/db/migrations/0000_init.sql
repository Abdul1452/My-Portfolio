CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`read` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_contacts_read` ON `contacts` (`read`);--> statement-breakpoint
CREATE INDEX `idx_contacts_created_at` ON `contacts` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_contacts_email` ON `contacts` (`email`);--> statement-breakpoint
CREATE TABLE `pm_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`tag` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`year` text NOT NULL,
	`link_label` text NOT NULL,
	`link_url` text,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pm_projects_slug_unique` ON `pm_projects` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_pm_projects_order` ON `pm_projects` (`order`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`tag` text NOT NULL,
	`description` text NOT NULL,
	`year` text NOT NULL,
	`category` text DEFAULT 'engineering' NOT NULL,
	`link_label` text NOT NULL,
	`link_url` text,
	`image_url` text,
	`featured` integer DEFAULT false NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	CONSTRAINT "projects_category_check" CHECK("projects"."category" IN ('engineering', 'pm'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_projects_category` ON `projects` (`category`);--> statement-breakpoint
CREATE INDEX `idx_projects_featured` ON `projects` (`featured`);--> statement-breakpoint
CREATE INDEX `idx_projects_order` ON `projects` (`order`);--> statement-breakpoint
CREATE TABLE `skill_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_categories_name_unique` ON `skill_categories` (`name`);--> statement-breakpoint
CREATE INDEX `idx_skill_categories_order` ON `skill_categories` (`order`);--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`percentage` integer NOT NULL,
	`category_id` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `skill_categories`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "skills_percentage_check" CHECK("skills"."percentage" BETWEEN 0 AND 100)
);
--> statement-breakpoint
CREATE INDEX `idx_skills_category_id` ON `skills` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_skills_order` ON `skills` (`order`);