/*
  Warnings:

  - You are about to drop the `Deal` table. If the table is not empty, all the data it contains will be lost.

*/

INSERT INTO "DealEvent" (id, "dealId", "type", payload, "createdAt")
SELECT
    gen_random_uuid(),
    id AS dealId,
    'CREATED' AS type,
    jsonb_build_object(
            'title', title,
            'description', description,
            'amount', amount,
            'status', status,
            'createdAt', "createdAt",
            'updatedAt', "updatedAt"
    ) AS payload,
    "createdAt"
FROM "Deal";

-- DropForeignKey
ALTER TABLE "DealEvent" DROP CONSTRAINT "DealEvent_dealId_fkey";

-- DropTable
DROP TABLE "Deal";
