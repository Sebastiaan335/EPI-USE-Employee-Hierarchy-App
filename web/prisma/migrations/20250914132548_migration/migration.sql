-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "surname" VARCHAR(100) NOT NULL,
    "birthdate" DATE NOT NULL,
    "employeenumber" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "salary" DECIMAL(12,2) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "managerid" INTEGER,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_employeenumber_key" ON "employees"("employeenumber");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "idx_employees_employee_number" ON "employees"("employeenumber");

-- CreateIndex
CREATE INDEX "idx_employees_manager_id" ON "employees"("managerid");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "fk_manager" FOREIGN KEY ("managerid") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
