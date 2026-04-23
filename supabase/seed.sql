insert into staff (id, full_name, role, phone, email, area_coverage, is_active) values
  (gen_random_uuid(), 'Anita Rao', 'nurse', '+919900000001', 'anita@aksraya.com', array['Indiranagar','Domlur'], true),
  (gen_random_uuid(), 'Karthik M', 'physiotherapist', '+919900000002', 'karthik@aksraya.com', array['HSR Layout','Koramangala'], true),
  (gen_random_uuid(), 'Sneha P', 'coordinator', '+919900000003', 'sneha@aksraya.com', array['Whitefield'], true);

insert into patients (full_name, phone, age, gender, area, diagnosis, status) values
('Ramesh Kumar', '+919900001001', 72, 'male', 'Indiranagar', 'Post-stroke care', 'active'),
('Lakshmi Devi', '+919900001002', 66, 'female', 'Jayanagar', 'Physiotherapy', 'active'),
('Naveen S', '+919900001003', 58, 'male', 'Whitefield', 'Diabetes care', 'active'),
('Priya Nair', '+919900001004', 48, 'female', 'HSR Layout', 'Post-op rehab', 'active'),
('Suresh B', '+919900001005', 75, 'male', 'Koramangala', 'Palliative support', 'inactive');

insert into leads (full_name, phone, service_interest, source, status) values
('Anil', '+919900010001', 'Nursing care', 'website', 'new'),
('Bhavna', '+919900010002', 'Physiotherapy', 'instagram', 'contacted'),
('Charan', '+919900010003', 'Elder care', 'referral', 'qualified'),
('Divya', '+919900010004', 'Post-op care', 'google', 'proposal_sent'),
('Eshan', '+919900010005', 'Nursing care', 'whatsapp', 'new'),
('Farah', '+919900010006', 'Rehab', 'walk-in', 'lost'),
('Giri', '+919900010007', 'Home visit', 'website', 'converted'),
('Hema', '+919900010008', 'Doctor consult', 'other', 'contacted');

insert into cases (patient_id, title, type, priority, status)
select id, 'Care escalation', 'escalation', 'high', 'open' from patients limit 1;
insert into cases (patient_id, title, type, priority, status)
select id, 'Weekly follow-up', 'follow-up', 'normal', 'open' from patients offset 1 limit 1;
insert into cases (patient_id, title, type, priority, status)
select id, 'Medication complaint', 'complaint', 'urgent', 'open' from patients offset 2 limit 1;

insert into schedules (patient_id, staff_id, scheduled_at, service_type, duration_minutes, status)
select p.id, s.id, now() + (i || ' day')::interval, 'Home Visit', 60, 'scheduled'
from patients p cross join lateral (select id from staff limit 1) s cross join generate_series(0,9) i limit 10;

insert into invoices (invoice_number, patient_id, line_items, subtotal, gst_amount, total_amount, status, due_date)
select 'AHC-2026-0001', id, '[{"service":"Nursing","qty":10,"rate":800}]'::jsonb, 8000, 1440, 9440, 'paid', current_date + interval '15 days' from patients limit 1;
insert into invoices (invoice_number, patient_id, line_items, subtotal, gst_amount, total_amount, status, due_date)
select 'AHC-2026-0002', id, '[{"service":"Physio","qty":8,"rate":900}]'::jsonb, 7200, 1296, 8496, 'sent', current_date + interval '15 days' from patients offset 1 limit 1;
