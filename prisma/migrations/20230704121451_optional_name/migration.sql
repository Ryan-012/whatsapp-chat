-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "number" TEXT NOT NULL,
    "step" INTEGER NOT NULL
);
INSERT INTO "new_User" ("id", "name", "number", "step") SELECT "id", "name", "number", "step" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
