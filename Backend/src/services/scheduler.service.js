import pool from '../db.js';

export const publishDueScheduledPosts = async () => {
  const now = new Date();
  const { rowCount } = await pool.query(
    `UPDATE posts
     SET status       = 'published',
         published_at = COALESCE(published_at, NOW()),
         updated_at   = NOW()
     WHERE status = 'scheduled'
       AND scheduled_at IS NOT NULL
       AND scheduled_at <= $1`,
    [now],
  );
  if (rowCount > 0) {
    console.log(`Scheduler: published ${rowCount} scheduled post(s).`);
  }
};

export const startScheduler = () => {
  publishDueScheduledPosts().catch((err) => {
    console.error('Scheduler initial run failed:', err.message);
  });
  setInterval(() => {
    publishDueScheduledPosts().catch((err) => {
      console.error('Scheduler interval failed:', err.message);
    });
  }, 60 * 1000);
};

