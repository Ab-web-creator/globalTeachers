import { database } from "../consultation/database";
import { analyticsRange, validatePageView } from "./validation";
import type { VisitLocation } from "./location";

export async function recordPageView(
  input: NonNullable<ReturnType<typeof validatePageView>>,
  location: VisitLocation = { country: null, city: null },
) {
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    // Serialize writes per anonymous visit and bound excessive repeat submissions.
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
      input.sessionId,
    ]);
    await client.query(
      `INSERT INTO site_page_views (id, session_id, path, country_code, city)
      SELECT $1, $2, $3, $4, $5 WHERE (
        SELECT count(*) FROM site_page_views WHERE session_id = $2 AND occurred_at > now() - interval '1 minute'
      ) < 30 AND NOT EXISTS (SELECT 1 FROM analytics_excluded_sessions WHERE session_id = $2)
      ON CONFLICT (id) DO NOTHING`,
      [input.id, input.sessionId, input.path, location.country, location.city],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function excludeAdminVisitSession(sessionId: string) {
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [sessionId]);
    await client.query("INSERT INTO analytics_excluded_sessions (session_id) VALUES ($1) ON CONFLICT DO NOTHING", [sessionId]);
    await client.query("DELETE FROM site_page_views WHERE session_id = $1", [sessionId]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}

export async function visitAnalytics(range: ReturnType<typeof analyticsRange>) {
  const db = database();
  const values = [range.from, range.to, range.timeZone];
  const where =
    "occurred_at >= $1::date::timestamp AT TIME ZONE $3 AND occurred_at < ($2::date + interval '1 day') AT TIME ZONE $3";
  const summary = await db.query<{
    views: number;
    visits: number;
    days: number;
  }>(
    `SELECT count(*)::int AS views,
    count(DISTINCT session_id)::int AS visits,
    count(DISTINCT (occurred_at AT TIME ZONE $3)::date)::int AS days FROM site_page_views WHERE ${where}`,
    values,
  );
  const series = await db.query<{
    period: string;
    views: number;
    visits: number;
  }>(
    `WITH periods AS (
      SELECT generate_series(date_trunc($4, $1::date::timestamp), date_trunc($4, $2::date::timestamp),
        CASE WHEN $4 = 'month' THEN interval '1 month' ELSE interval '1 day' END) AS period
    ), totals AS (
      SELECT date_trunc($4, occurred_at AT TIME ZONE $3) AS period,
        count(*)::int AS views, count(DISTINCT session_id)::int AS visits
      FROM site_page_views WHERE ${where} GROUP BY 1
    ) SELECT to_char(p.period, 'YYYY-MM-DD') AS period, COALESCE(t.views, 0)::int AS views,
      COALESCE(t.visits, 0)::int AS visits FROM periods p LEFT JOIN totals t USING (period) ORDER BY p.period`,
    [...values, range.group],
  );
  const pages = await db.query<{ path: string; views: number; visits: number }>(
    `SELECT path, count(*)::int AS views,
    count(DISTINCT session_id)::int AS visits FROM site_page_views WHERE ${where}
    GROUP BY path ORDER BY views DESC, path LIMIT 12`,
    values,
  );
  const countries = await db.query<{
    country_code: string | null;
    views: number;
    visits: number;
  }>(
    `SELECT country_code,
    count(*)::int AS views, count(DISTINCT session_id)::int AS visits FROM site_page_views WHERE ${where}
    GROUP BY country_code ORDER BY views DESC, country_code NULLS LAST`,
    values,
  );
  const cities = await db.query<{
    city: string | null;
    country_code: string | null;
    views: number;
    visits: number;
  }>(
    `SELECT city, country_code,
    count(*)::int AS views, count(DISTINCT session_id)::int AS visits FROM site_page_views WHERE ${where}
    GROUP BY city, country_code ORDER BY views DESC, city NULLS LAST, country_code NULLS LAST LIMIT 20`,
    values,
  );
  const recent = await db.query<{
    path: string;
    occurred_at: Date;
    country_code: string | null;
    city: string | null;
  }>(
    `SELECT path, occurred_at, country_code, city FROM site_page_views
    WHERE ${where} ORDER BY occurred_at DESC LIMIT 12`,
    values,
  );
  return {
    summary: summary.rows[0],
    series: series.rows,
    pages: pages.rows,
    recent: recent.rows,
    countries: countries.rows,
    cities: cities.rows,
  };
}
