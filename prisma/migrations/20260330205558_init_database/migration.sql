-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('USER', 'GROUP');

-- CreateTable
CREATE TABLE "nodes" (
    "id" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_closures" (
    "ancestor_id" TEXT NOT NULL,
    "descendant_id" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,

    CONSTRAINT "node_closures_pkey" PRIMARY KEY ("ancestor_id","descendant_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nodes_email_key" ON "nodes"("email");

-- CreateIndex
CREATE INDEX "node_closures_ancestor_id_idx" ON "node_closures"("ancestor_id");

-- CreateIndex
CREATE INDEX "node_closures_descendant_id_idx" ON "node_closures"("descendant_id");

-- CreateIndex
CREATE INDEX "node_closures_depth_idx" ON "node_closures"("depth");

-- AddForeignKey
ALTER TABLE "node_closures" ADD CONSTRAINT "node_closures_ancestor_id_fkey" FOREIGN KEY ("ancestor_id") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_closures" ADD CONSTRAINT "node_closures_descendant_id_fkey" FOREIGN KEY ("descendant_id") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
