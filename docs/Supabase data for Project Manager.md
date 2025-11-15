Supabase Project: `project_manager`

- Password: _(refer to Supabase dashboard or secure vault)_
- JWT secret: _(refer to Supabase dashboard or secure vault)_
- Service role key: _(refer to Supabase dashboard or secure vault)_
- Connection template: `postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres`
- `NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>`

See `env.example` for the full list of environment variables. Never commit live credentials.
