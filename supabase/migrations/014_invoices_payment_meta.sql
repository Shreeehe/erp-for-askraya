alter table invoices add column if not exists care_manager text;
alter table invoices add column if not exists payment_reference text;
alter table invoices add column if not exists payment_method text;
alter table invoices add column if not exists payment_date text;
