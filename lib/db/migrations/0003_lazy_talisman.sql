CREATE TABLE `security_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`ip` text NOT NULL,
	`user_agent` text,
	`details` text NOT NULL,
	`severity` text NOT NULL,
	`timestamp` integer,
	`resolved` integer DEFAULT false
);
--> statement-breakpoint
ALTER TABLE blocked_ips ADD `expires_at` integer;