--- Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger
CREATE TRIGGER update_venue_updated_at
BEFORE UPDATE ON venue
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_music_artist_updated_at
BEFORE UPDATE ON music_artist
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_music_event_updated_at
BEFORE UPDATE ON music_event
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();