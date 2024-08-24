# BoonWeGig

Indie concert discovery site for South Korea.

## Post-mortem

As of Nov. 27 2023 the site is no longer updating. My decision to use Instagram as a data source while initially effective, is not a good long term solution. I considered pivoting to a standard CRUD app where concert data is uploaded by users instead of scraped, but after learning of [Instagram's plans to release an events feature](https://purplegiraffe.com.au/instagram-unveils-new-events-feature/), I decided to put the project on hold and work on something else.

## Architecture

We have 2 main servers:
- **Client server**: serves client code
  - **Tech**: Next.js
  - **Host**: Vercel
- **Scraper server**: runs cron jobs to periodically scrape data
  - **Tech**: node.js
  - **Host**: DigitalOcean VPS

Some key jobs that we run:
- Everyday scraper runs @ 16:00 UTC 
- Everyday gh actions backups DB @ 17:00 UTC
- Everyday gh actions redeploys our client server @ 17:30 UTC
  - This is done so DB changes get reflected on client (currently we leverage only static rendering on the client, so redeploying is the only way to show DB changes)

## Reminders (for moi)
- When you change ChatGPT prompt: go to dev environment, clear database, clear `posts` cache (you can keep `users` cache), and rerun `yarn dev` to try seeing results of new prompt
- When you change any other part of the parsing process: just clear database, don't clear `posts` cache.
- Check npm dependencies + umami updates
- Scraping Exceptions:
  - Jebidabang: b/c they don't upload timely posts but their concerts are lit, do a slightly manual scrape workflow - get their calendar html and pass it to chatgpt to parse out events
- Coding convetions:
  - enum values and names should always be UPPERCASE and stored as UPPERCASE in the db
- Backing up db locally:
  - `pg_dump -U me -h localhost -p 5432 -Fc boon_we_gig_dev > event-scraper/backups-dev/duplicates-backup.dump`
    - `-Fc` formats backup for `pg_restore`

## Testing
- test naming format: "Should [expected result] when [scenario/case]"
- Setup:
  - on your local machine using `psql` create a `boon_we_gig_dev` database and `boon_we_gig_test` database and copy the necessary credentials into `.env.development` and `.env.test`.

## Instagram post examples:
- post with full data: https://www.instagram.com/p/CxZz_PgJXkt/
- post with multiple events: 
  - https://www.instagram.com/p/Cxw_37brAPc/ (no times outlined)
  - https://www.instagram.com/p/CyNhHf3LQmB/ (times and price info outlined)
  - https://www.instagram.com/p/CyvLl6-xKnT/?img_index=2
- post with donation text: https://www.instagram.com/p/Cx5ZJfRrGNS/
- post not advertising anything (but subtle): https://www.instagram.com/p/Cx-nt3-JsH-/
- post really not advertising anything: 
- DJ example: https://www.instagram.com/p/Cx4xTQORHFT/
- art example: https://www.instagram.com/p/CxpeoFHO7xc/
- venue posting event at a different location: https://www.instagram.com/p/CxZCUwhSkId
- festival promotion (not at venue): https://www.instagram.com/p/CwzI02ULCcd/
- post that chatpgt sometimes thinks has multiple events when it only has one: https://www.instagram.com/p/CyC7MiDrU7D/
- post with multiple dates but no times: https://www.instagram.com/p/CzSEQfpsmAE/?hl=en&img_index=1
- post that has multiple dates and multiple times but chatgpt said it has single date multiple times: https://www.instagram.com/p/CzaotXlRNSS/
- post that specifies times but not a day: https://www.instagram.com/p/Cy77o0nusN0/
- post that has an artwork credit but chatgpt thinks its the artist: https://www.instagram.com/p/CyuUEIKp3ai/
  - another example: https://www.instagram.com/p/CzAQV6yP4c4/
- post where chatgpt think its a dj event where its actually a concert: https://www.instagram.com/p/CzQ8VqoLWwI/
- post where year isn't specified and chatgpt hallucinates: https://www.instagram.com/p/CzdE-uCrpJh/
- post where not clear that post is advertising a music event: 
  - https://www.instagram.com/p/CzbXIQfrHPJ/
  - https://www.instagram.com/p/CzfO58JpkxG/
- post that wasn't able to be parsed properly for some reason: https://www.instagram.com/p/CzlmVxzpgNc/