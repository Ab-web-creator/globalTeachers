-- Agreed package allowances. Only VIP may receive an individual admin override.
UPDATE client_package_allowances SET hours = CASE tier WHEN 'PRO' THEN 3 ELSE 1 END;
UPDATE private_clients SET allowance_hours = NULL WHERE tier IN ('START', 'PRO');
