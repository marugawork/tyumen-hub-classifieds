CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_role_uniq ON public.user_roles(user_id, role);

CREATE OR REPLACE FUNCTION public.grant_bootstrap_super_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'ooorumarket@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_bootstrap_admin
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.grant_bootstrap_super_admin();

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin' FROM auth.users WHERE lower(email) = 'ooorumarket@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

GRANT SELECT ON public.user_roles TO authenticated;