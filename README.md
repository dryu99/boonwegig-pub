# BoonWeGig

Indie concert discovery site for South Korea.

(As of Nov. 27 2023 the site is no longer updating. See Post-mortem below for details.)

## Post-mortem

Welp. As of Nov. 27 2023, I just found out that Instagram is releasing a new feature for creating events on their platform. I think this effectively kills any long term plans I had for this site because:
- They have direct access to all the data my site relies on i.e. their data will always be exponentially higher in quality than mine
- They already have the platform and users in place
  - Even if hypothetically I onboarded some venues/artists onto my site, the amount of traffic i'll ever have is peanuts compared to instagram, which doesn't give much incentive for anyone to onboard onto my site
- Everything i dreamt of doing with my site they can replicate but better (e.g. search by event types, genres)

The only competitive advantages that BoonWeGig has that I can think of:
- Specialization with korea (which isn't what i wanted to do longterm if BoonWeGig took off).
- ~~Specialization with venues~~: the longeterm workflow for Instagram prob looks like this: user clicks on "concerts near me" -> gets presented with a list of concerts with key information and links. But those concerts could be anything... any john doe could create a concert event, but fb will prob find a way to verify/algorithmically push up events. what they won't likely have though is a list of events though from a select number of accounts.
  - although I can imagine they could easily add that feature, allowing users to create personal lists of following profile events e.g. my "seoul concerts list" which tracks events for the legit indie venues in seoul. this list could be shared among ppl. nvm
- Going the oh my rockness route with a catered catalogue of concerts (ccc). but i dont think i want to do that.
- Not being social media lol
- Having less bad actors: this is actually quite nice. its easy for me to verify legitimate artists and venues. but facebook prob can too.
- Minimalistic stripped down ui

### Lessons learned
- Trying to create software that entirely revolves around someone else's data/services isn't a great idea (for any longterm aspirations at least)
- Do more research beforehand (Would've been nice to know about instagram events before I started)

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

## Reminders
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