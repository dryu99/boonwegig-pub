# BoonWeGig

## Reminders
- When you change ChatGPT prompt: go to dev environment, clear database, clear `posts` cache (you can keep `users` cache), and rerun `yarn dev` to try seeing results of new prompt
- When you change any other part of the parsing process: just clear database, don't clear `posts` cache.

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
  - [x] fuck how do pinned posts work... (https://www.instagram.com/seendosi/)
    - they appear first in the list when we scrape shieeeee okay that's not ideal but what can you do.
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
- [x] handle case where ```json ... ``` is given by chatgpt lol
- [x] look into why most music events in the new db dont have event type set...
  - [x] it's because all our chatgpt data was cached before we made the event type changes
- [x] double check dates in new db (does offset match)
- [ ] maybe handle artist names that start with @ (can just do some simple string parsing)
- [x] look into insta api, the library we're using is pretty sus and stopped working randomly
- [x] should account id be username... fir venues
- [x] finish off insta account scrape method and, fix todos in there, and refactor to reduce duplication in there
- [x] will prob need to look into a way to automate insta cookie update? or mayebe just keep using existing cookie until it fails (its been working for me so far)
  - THE PROBLEM: insta seems to ip block me at some point if i spam requests
  - Okay after doing some research it seems pretty difficult to scrape on my own. Facebook cracksdown on scraping hard and I've already been IP banned. I could try to work around it with ip rerouting + auto account creation but even then it doesn't seem guaranteed and seems like it'll take too long.
  - SOLUTION: use a bunch of paid services, ideally in the free tier.
    - for event scraping, use rapid api + __ and have logic to switch between the different scraper providers. try to get away with not paying for now.
    - for user scraping, just do manually with your webinfo url you have and use vpn to switch.
  - [ ] create a boon we gig gmail account
  - [x] find a list of FREE scraping apis (if the api only requires an email then I can be more sneaky and just make multiple email accounts. TRY SINGLE SERVICE, MULTIPLE EMAIL METHODS FIRST just to keep things simple. if that doesnt work move on to multiple services single email)
    - [x] https://rapidapi.com/mrngstar/api/instagram-api-20231/
    - [x] https://rapidapi.com/mrngstar/api/instagram-bulk-scraper-latest/
    - [x] https://scrapfly.io/pricing
    - [x] https://webscraping.ai/#pricing <-- WE CHOSE THIS ONE
  - [x] create a dynamic module that can switch between these different providers when fetching data
- [x] write script for saving new venues
- [x] maybe increase cache ttl? only needed for case we have invalid music events we dont save to db and have to reparse again after x ttl days where the instagram account hasn't posted much during that time period
- [x] look into imiplementing chatgpt cache so we don't repeat queries on debug (+ testing)
  - [x] do simple one for now where each event link is mapped to its parsed json
  - [x] how to handle in production? should be fine if there's a TTL
- [x] be more specific for logging at scraper end (include which events and artist names got persisted to db, not just a count)
- [x] double check chatgpt prompt
  - [ ] just in general, go through list of edge cases below and try to fix and test with playground
  - [ ] also check errors in logs to see all posts that failed to make the cut and why they did (might be skipping valid posts)
  - [ ] also just go through localhost boonwegig and see if everything is accurate
  - [x] how does chatgpt know what to set for the year actaully? maybe i should look into leveraging the instagram post timestamp somehow...
    - [ ] DO LATER
  - [ ] drop db and reseed every time you make prompt changes
  - [x] figure out why 100% Lovers Rock event couldn't be created properly (we should really create custom errors for chatgpt)
- [x] ananlyze the 502 error text file i got
- [x] add instagram_id field and down up db (just to see lol)
- [x] add a happy path for MULTIPLE_DAYS option where we can ask chatgpt if the same artist is performing or not
  - [ ] do this later
- [x] damnit the single day multiple time case gets flagged for things like "sep 9, 8-11pm" since technically those are two times... its still okay i guess since its still a happy path but we should prob look into it
- [x] consider adding some tests for chatgpt numeric responses, just so evrytime we change the prompt, we still get what we expect more or less. even though we'll get charged for running these tests, we won't need to run them often, only when we change the prompt
  - [ ] DO LATER
  - [ ] just have a few basic tests (1 valid post, a few invalid)
- [x] make changes to separate better between debug and info logs (we have way too many info logs)
  - [ ] info logs go into prod
  - [ ] debug logs are for dev
  - [ ] investigate why logs aren't always written to file (maybe im logging too much)
  - [ ] DO LATER
- [x] double check what to do with isFree flag. maybe we make this NON NULL too. 
  - [ ] also check how it works with donation text
  - [ ] DO LATER
- [ ] set up vps (for scraper)
- [ ] set up cron jobs
  - [ ] delete rows in prod db
  - [ ] make sure scraper db is pointing to prod supabase.
  - [ ] double check how we can handle dates, we might need to use a date library or do some kind of country code check to make sure that we're storing correct timezones
- [x] write script that'll print out all needs_review rows for all tables (maybe write sql for db beaver)
  - [x] check how easy it is to edit stuff in db beaver
- [x] see how painful it is to manually check things
- [ ] figure out db backups
  - [ ] prod: https://supabase.com/docs/guides/platform/backups
  - [ ] dev: just create cron job to run pg_dump every 24 hrs
- [ ] figure out how to handle logs when you deploy your app
  - [ ] don't need to write to file prob (maybe only for scraper)
  - [x] how to handle errors. saving stack traces to files doesnt sound great (too big) im just console erroring alongside logger.error for now
  - [x] keep logger file writing for development, it's pre helpful
- [ ] in chatgpt prompt add logic that checks for @ (means its an insta username)
- [ ] look into finetuning: https://platform.openai.com/docs/guides/fine-tuning/preparing-your-dataset (more expensive tho)
- [ ] fix time problems again sigh... go through localhost and look at bottom events where they're set 2025. these mostly seem invalid
- [x] when you finally scrape instagram_id for the initial scraped venues, turn the column NOT NULL 
- [x] find better way to handle error logging crap 
  - [x] my error utils method isn't perfect for complicated errors and winston doesn't like it. would be cool if i could just pass in error to winston logger instead of doing all this json nonsense
- [ ] do another sanity check on localhost frontend just to see that things make sense (e.g. artists being properly tagged, names make sense, dates make sense, links make sense)
- [x] maybe worth making custom errors for chatgpt invalid parsing cases (we can store these in the cache too?)
- [ ] double check dates 
  - [ ] when we get a date col from the db, the js date object we get is UTC-ified or at least knows about the timezone (im worried that the physical location of the server the db lives on will affect the date that's queried)
- [ ] lol a lot of instagram names still aren't great, might need to do things manually
- [x] look into the datadog logging for backend you did or wahtever it was called
- [ ] concert type isn't always accurate, maybe leave it out for now?
- [x] double check if sentry error handling is okay (maybe logging too much)
  - [x] look into how deep sentry can print extra data
- [ ] maybe we should actually store invalid events in the db (not every post, just the events that are invalid like the duplicate post ones: https://www.instagram.com/p/Cyss2CsxeHj/)
  - [ ] and then we can just flag as INVALID for review_status or sth?


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
- [ ] make font smaller, bigger font looks more unprofessional for some reason. just compare with oh my rockness
- [ ] add translation for korean (i wanna show title in korean + dates and stuff too)
- [ ] add analytics
 
## Marketing TODOs
- [x] before site is formally deployed, reach out to organizers and ask them if its okay to scrape data from their accounts... or maybe not and say fuck it ill do it myself.
  - yeah do first apologize later.
- Figure out SEO
- Maybe the goal is to get people creating accounts on my platform... mainly to get them to fix all the inaccurrate info thats bound to appear lol
  - okay so lets think of the workflow:
    1. artist/venue/attendee sees inaccurate info on site
    2. they want to change it
    3. i can either have them report it to me so i can change it, or i can let 

Notes
- i should have a personal guideline for scraping phase that i won't go 110% to collect data that is unreasonably difficult to collect e.g. only in image
- possible for instagram posts uploaded to be promotions but contain no data because its all in the photo. you can infer these empty event promotions from non-promotion posts via the props
- a lot of phase 1 is just going to be finding edge cases with posts and making the prompt smarter


## Edge case examples:
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
