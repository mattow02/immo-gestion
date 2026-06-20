CREATE OR REPLACE FUNCTION public.activate_invitation(code_text TEXT)
RETURNS jsonb AS $$
DECLARE
  inv RECORD;
  prop RECORD;
BEGIN
  SELECT * INTO inv FROM invitation_codes WHERE code = code_text AND used = false;
  IF NOT FOUND THEN
    RETURN '{"error":"Code invalide ou deja utilise"}'::jsonb;
  END IF;

  SELECT current_rent INTO prop FROM properties WHERE id = inv.property_id;

  UPDATE invitation_codes SET used = true, used_at = now() WHERE id = inv.id;

  INSERT INTO tenancies (property_id, tenant_id, start_date, rent_amount, status)
  VALUES (inv.property_id, auth.uid(), CURRENT_DATE, COALESCE(prop.current_rent, 0), 'active');

  RETURN '{"success":true}'::jsonb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
