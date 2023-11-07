# BoonWeGig

## Event Review Workflow
1. Events missed b/c the post had too many events: Look at winston logs
2. Events missed b/c of missing important metadata: Check DB and filter `review_status = "PENDING"` in `music_event`

## Busan TODOS
- [x] setup serverless db (supabase) and migrate local db to it
  - don't worry about diff environments + migrations for now.
  - just use prod db for testing for now lolol
- [x] setup db queries that properly joins tables (we need venue and artist metadata)
  - [x] look into whether sharing keyslely code is worth it right now
  - [x] the db query should only fetch events that are incoming (no past events)
- [ ] go finish up your web scraper todos and seed db
- [ ] implement basic frontend (with nextjs)
  - [x] add city filter
  - [x] add venue link (with cute location icon or sth)
  - [ ] implement pagination
  - [ ] figure out how to make separation between different events clearer (look at reddit and hackernews)
  - [ ] maybe look into centering things better
  - [ ] fix detailed styling issues
- [ ] setup custom domain
- [ ] deploy scraper to VPS
  - [ ] setup cron jobs
- [ ] go to a busan show and talk to some people to find out about other venues/instagram accounts
  - [ ] IDEALLY your mvp is finished by then


## Backend TODOs
- [x] create models in db for venues and artists. The idea is that we want to catalog all indie venue and artist info in a database and will update and collect data gradually.
- [x] handle case where chatgpt output returns an array (i.e. a single post advertised multiple events)
  - [x] also how do i handle scenario where insta post pre-promotions e.g. theyre advertising an event but dont have enough details yet 
    - i don't think it makes sense to add to the db. why advertise an event if you dont even know what time its gonna be at. we should ONLY COLLECT FULLY SCHEDULED EVENTS 
- [x] figure out how to reduce chatgpt costs
- [x] handle venue location address in data extractiobn?
- [x] handle donation ticket case for price
- [x] add city and country to venue model
- [x] fix logger
- [x] review chatgpt prompt. try to optimize and figure out how we can track logs of responses from it
  - [x] just worry about music shows, no art or comedy or whatever (dont need 4 prompts). scope creep is real + chatgpt is more expensive than i thought
- [x] come up with chatgpt cost calculator for my usage
  - right now it's about 5 cents per post? double check  
- [x] use spotify/youtube for finding artist pages + genres (just use spotify for mvp)
- [x] add country field to artist
- [x] look into this hongdae ff event with lego person. example of an event that posts multiple time slots for a single event. scraper might get confused
- [x] handle scrape a venue advertises an event for a different venue
  - some venues don't have instagram accounts. its just a random venue 
  - locationName field? we don't want to have the address
  - i think we add locationName to MusicEvent table if locationName is null its assumed the advertising venue is the location (or it could just be a pre ad that'll show the real location later...)
  - maybe track address too to help chatgpt with deciprhering between locationName and address
- [x] clean up data in venue table in db. only handle seoul shows for now
- [x] think about having a user vs venue table
- [x] think about how to handle chatgpt extraction that fails
- [x] think about adding a review_note field to tables to give you more context when reviewing
- [x] add more unique constraints to tables
- [x] add save artist + save artist_event rows to db
- [x] do an initial scrape!!! (just 1 venue)
- [x] look into data you scraped and figure out bugs
  - [x] check individual instagram posts and see if chatpgt correclty identified the error
  - [x] handle startDateTime being NOT NULL
  - [x] delete location_name column and add new constraint (venue id + start date time)
  - [ ] handle case where artistNames contains name of venue
  - [ ] handle case where start date time is wack (e.g. in the past)
  - [ ] handle case where artist names are insta tags (can see with prefixed @ symbol)
  - [ ] INSTEAD of coming up with a billion edge cases and trying to support every venue, just pick a select few venues you like and have well formatted posts. in the mid-run, venues who want to buy in will format their posts to work better
- [x] do another initial scrape with 1 venue to confirm changes were good
  - [x] delete bad data from db first
- [x] implement instagram id check to avoid redundant scrapes
  - [x] use cache? or db? prob file cache is good enough?
  - [ ] fuck how do pinned posts work... (https://www.instagram.com/seendosi/)
- [ ] figure out db migrations (or how to store create table schemas locally. kysley schema doesnt cover everything e.g. unique constraints)
  - [ ] maybe add created_at and updated_at to relationship tables
  - [ ] watch video on migrations
- [x] clear database and delete the hongdaeff events with 100 artists lmao (cascading?)
  - actually its fine, we can have wack stuff in our local db. its production that we should clean up first though
- [x] maybe adjust workflow to handle one post at a time
- [ ] figure out how to handle hanging async calls (e.g. chatgpt sometimes hangs)
  - [ ] this seems more like a network issue than chatgpt api... would still be good to have a util function or sth
- [x] don't persist events (or set as invalid) that have a date in the past
  - [x] or maybe its okay, since the client just fetches future events
- [ ] scrape the rest 
- [x] look into imiplementing chatgpt cache so we don't repeat queries on debug (+ testing)
  - [x] do simple one for now where each event link is mapped to its parsed json
  - [ ] how to handle in production? should be fine if there's a TTL
- [ ] double check what to do with isFree flag. maybe we make this NON NULL too. 
  - [ ] also check how it works with donation text
- [ ] set up vps (for scraper)
- [ ] set up cron jobs
  - [ ] delete rows in prod db
  - [ ] make sure scraper db is pointing to prod supabase.
- [ ] write script that'll print out all needs_review rows for all tables (maybe write sql for db beaver)
  - [ ] check how easy it is to edit stuff in db beaver
- [ ] see how painful it is to manually check things
- [ ] figure out db backups
- [ ] look into supporting scraping for post with multiple events (look at examples below)
- [ ] figure out how to handle logs when you deploy your app
  - [ ] don't need to write to file prob (maybe only for scraper)
  - [ ] how to handle errors. saving stack traces to files doesnt sound great (too big) im just console erroring alongside logger.error for now
  - [ ] keep logger file writing for development, it's pre helpful
- [ ] in chatgpt prompt add logic that checks for @ (means its an insta username)

##  Frontend TODOs
- [ ] create an About page
  - [ ] outline participation instructions (#boonwegig)
    - [ ] decide on whether or not its a good idea to have this on my site lol. maybe better to keep it lowkey via email
    - [ ] decide on scraping instructions
      - add hashtag
      - should i recommend they make it more structured? if i let them have free reign there's way more potential for the AI to hallucinate. for example: https://www.instagram.com/p/CyIe5UXrTac/ this post has hashtags that are intepreted as band names even though one of them is the venue name.
      - If i ask them to put the info underneath #boonwegig they might not be happy with the forced formatting
      - I think asking them to put a hashtag #boonwegig_eventtype is a good way to go. the thing chatgpt has the most trouble determining usually is the event type (e.g. club vs concert)
        - think of more things chatgpt has a hard time with
        - tbh this is really just an edge case for venues that host multiple kinds of events. i mean that's totally fair (channel 1969, hongdaeff)
  - [ ] add a "last edited" footnote so people are aware of updates
- [ ] think about how you want to handle displaying artist info
  - [ ] sending to another page seems annoying, but hover tooltip won't work well on mobile
  - [ ] add tracking (want to see country stats)
 
## Marketing TODOs
- [x] before site is formally deployed, reach out to organizers and ask them if its okay to scrape data from their accounts... or maybe not and say fuck it ill do it myself.
  - yeah do first apologize later.

Notes
- i should have a personal guideline for scraping phase that i won't go 110% to collect data that is unreasonably difficult to collect e.g. only in image
- possible for instagram posts uploaded to be promotions but contain no data because its all in the photo. you can infer these empty event promotions from non-promotion posts via the props
- a lot of phase 1 is just going to be finding edge cases with posts and making the prompt smarter


Edge case examples:
- post with full data: https://www.instagram.com/p/CxZz_PgJXkt/
- post with multiple events: 
  - https://www.instagram.com/p/Cxw_37brAPc/ (no times outlined)
  - https://www.instagram.com/p/CyNhHf3LQmB/ (times and price info outlined)
- post with donation text: https://www.instagram.com/p/Cx5ZJfRrGNS/
- post not advertising anything (but subtle): https://www.instagram.com/p/Cx-nt3-JsH-/
- post really not advertising anything: 
- DJ example: https://www.instagram.com/p/Cx4xTQORHFT/
- art example: https://www.instagram.com/p/CxpeoFHO7xc/
- venue posting event at a different location: https://www.instagram.com/p/CxZCUwhSkId
- festival promotion (not at venue): https://www.instagram.com/p/CwzI02ULCcd/
- FIND EXAMPLE THAT IS MISSING DATA BUT IS VALID EVENT