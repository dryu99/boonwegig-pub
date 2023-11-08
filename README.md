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
  - [ ] make day in the month/day text double digit (e.g. 01 instead of 1)
  - [ ] implement pagination
  - [ ] figure out how to make separation between different events clearer (look at reddit and hackernews)
  - [ ] maybe look into centering things better
  - [ ] fix detailed styling issues
- [ ] before going live, see how you can strip features to their most basic use (for future monetisation opportunities yeesh i feel kind of scummy lol)
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
- [x] maybe adjust workflow to handle one post at a time
- [x] figure out how to handle hanging async calls (e.g. chatgpt sometimes hangs)
  - [x] this seems more like a network issue than chatgpt api... would still be good to have a util function or sth
- [x] don't persist events (or set as invalid) that have a date in the past
  - [x] or maybe its okay, since the client just fetches future events
- [x] look at all errors in logs (from recent busan scrape) and address problems
  - [x] fix bug where empty post text isn't handled
  - [x] print errors out better (sometimes context is hidden because they dont deep print)
  - [x] also look at edge case where instagram account posts twice. this means that the event existence check will fail since we currently do it by link. prob have to do with other fields.
    - [x] should we parsing out date + time separately? the primary key right now is (date, venue, band_name_lower_case). i think we can assume time isn't needed
    - [ ] for now for a fix, just don't persist events that happened in the past...
  - [x] look into bug where some posts are being identified as having multiple events even when theyre not... sigh
- [x] figure out how to handle dates (rn everything is being run from my machine)
  - [x] first try seeing how i can insert a sample event with a custom utc time string WITH the timezone offset
  - [x] then decide on where to store timezones (either in-memory map or db)
- [x] should we allow events with 0 artists to be persisted? I said no initially because there are a lot of insta posts out there that have nothing to do with concerts and dont have artists, but chatgpt wouldn't be able to tell.
  - [x] i think for now no.
- [x] figure out db migrations (or how to store create table schemas locally. kysley schema doesnt cover everything e.g. unique constraints)
  - [x] maybe add created_at and updated_at to relationship tables
  - [x] watch video on migrations
  - [ ] figure out workflow for cloud migration (maybe i just run it locally and connect to prod db)
  - [x] try deleting database (run down?)
  - [x] scrape the rest and reseed local db
    - CHECKLIST
      - [x] dates are good
      - [x] check frontend and make sure nothings wack
- [x] read more about chatgpt api capabilities: https://platform.openai.com/docs/guides/text-generation/json-mode
- [x] replace dbtypes codegen command with bash script (since it has a local path)
- [x] maybe add unique constraint for music even startdatetime + venue id (look at dump sql)
- [ ] ...handle case where ```json ... ``` is given by chatgpt lol
- [x] look into why most music events in the new db dont have event type set...
  - [x] it's because all our chatgpt data was cached before we made the event type changes
- [ ] double check dates in new db (does offset match)
- [ ] maybe handle artist names that start with @ (can just do some simple string parsing)
- [x] write script for saving new venues
- [x] maybe increase cache ttl? only needed for case we have invalid music events we dont save to db and have to reparse again after x ttl days where the instagram account hasn't posted much during that time period
- [x] look into imiplementing chatgpt cache so we don't repeat queries on debug (+ testing)
  - [x] do simple one for now where each event link is mapped to its parsed json
  - [x] how to handle in production? should be fine if there's a TTL
- [ ] double check what to do with isFree flag. maybe we make this NON NULL too. 
  - [ ] also check how it works with donation text
- [ ] set up vps (for scraper)
- [ ] set up cron jobs
  - [ ] delete rows in prod db
  - [ ] make sure scraper db is pointing to prod supabase.
  - [ ] double check how we can handle dates, we might need to use a date library or do some kind of country code check to make sure that we're storing correct timezones
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
- [ ] look into finetuning: https://platform.openai.com/docs/guides/fine-tuning/preparing-your-dataset (more expensive tho)

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
- [ ] make mobile friendly
 
## Marketing TODOs
- [x] before site is formally deployed, reach out to organizers and ask them if its okay to scrape data from their accounts... or maybe not and say fuck it ill do it myself.
  - yeah do first apologize later.
- Figure out SEO

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
- post that chatpgt sometimes thinks has multiple events when it only has one: https://www.instagram.com/p/CyC7MiDrU7D/
- post with multiple dates but no times: https://www.instagram.com/p/CzSEQfpsmAE/?hl=en&img_index=1
- FIND EXAMPLE THAT IS MISSING DATA BUT IS VALID EVENT


For the given text reply with:
- "1" if a single date and single time are mentioned
- "2" if a single date and multiple times are mentioned
- "3" if a single date and no times are mentioned
- "4" if a multiple dates are mentioned
- "5" if anything else


Reply with:
- "1" if the text is advertising a music concert
- "2" if the text is advertising a DJ event
- "3" if the text is advertising an art show
- "4" if anything else

Extract the following event data from the post into JSON:
{
startDateTime: string; // ISO format
isFree: boolean;
artists: string[];
}