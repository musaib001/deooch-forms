-- Adds the 'free' self-signup role. Must be its own migration/transaction —
-- Postgres won't let a new enum value be used in the same transaction it
-- was added in (see 0004_free_tier_rls.sql for the policies that use it).

alter type user_role add value 'free';
