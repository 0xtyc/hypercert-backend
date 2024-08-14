CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`address` text NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_address_unique` ON `users` (`address`);