-- Replace "your_schema" and "your_table"

SELECT 'INSERT INTO ' || table_name || ' (' || string_agg(column_name, ', ') || ') VALUES ('
FROM information_schema.columns
WHERE table_schema = 'your_schema' AND table_name = 'your_table'
GROUP BY table_name; 


-- Example INSERT INTO query for music_event table (may need to update as table changes)
INSERT INTO music_event (id, link, review_status, start_date_time, event_type, is_free) VALUES (
  uuid_generate_v4(), 'example.com', 'VALID', '2023-02-20T11:00:00.000+09:00', 'CONCERT', true
)