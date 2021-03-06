import { cmd } from ".";
import { db, logger } from "../util";

cmd
  .command("db:migrate", "Run all the pending database migrations.")
  .example("db:migrate")
  .example("db:migrate --target primary")
  .option("--target", "The target database to work with.", "primary")
  .action(async (opts) => {
    try {
      if (!db[opts.target]) {
        throw new Error(`The '${opts.target}' database doesn't exist.`);
      }

      logger.info(`Started migrating the '${opts.target}' database to latest...`);
      await db[opts.target]?.migrate.latest();
      logger.info(`Started migrating the '${opts.target}' database to latest... SUCCESS`);
    } catch (err) {
      logger.error(err);
      process.exit(1);
    } finally {
      db[opts.target]?.destroy();
    }
  });
