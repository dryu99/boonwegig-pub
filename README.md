# BoonWeGig

Website that aims to support local artists and venues. Not big artists swinging by town. Born out of a desire to support the culture.

## Post-mortem

Welp. As of Nov. 27 2023, I just found out that Instagram is releasing a new feature for creating events on their platform. I think this effectively kills any long term plans I had for this site because:
- they have direct access to all the data my site relies on i.e. their data will always be exponentially higher in quality than mine
- they already have the platform and users in place
  - even if hypothetically I onboarded some venues/artists onto my site, the amount of traffic i'll ever have is peanuts compared to instagram, which doesn't give much incentive for anyone to onboard onto my sketchy lookin ass site
- everything i dreamt of doing with my site they can replicate but better (e.g. search by event types, genres)
- advertising on insta is 100x more effective than doing it on my site 

The only competitive advantages I have that I can think of:
- specialization with korea (which isn't what i wanted to do longterm if boonwegig took off).
- ~~**specialization with venues**~~: the longeterm workflow for insta prob looks like this: user clicks on "concerts near me" -> gets presented with a list of concerts with key information and links. But those concerts could be anything... any john doe could create a concert event, but fb will prob find a way to verify/algorithmically push up events. what they won't likely have though is a list of events though from a select number of accounts.
  - although I can imagine they could easily add that feature, allowing users to create personal lists of following profile events e.g. my "seoul concerts list" which tracks events for the legit indie venues in seoul. this list could be shared among ppl. nvm
- going the oh my rockness route with a catered catalogue of concerts (ccc). but i dont think i want to do that.
- not being social media lol
- **having less bad actors**: this is actually quite nice. its easy for me to verify legitimate artists and venues. but facebook prob can too.
- specialized stripped down ui

damn this sucks. lessons learned:
- creating software that entirely revolves around someone else's data/services is a bad idea
- creating software that can be easily replicated by a mega corporation is a bad idea (if you're trying to make money)

even though my initial goal wasn't to make money with boonwegig, the idea and dream became so grand that it eventually did. i had a lot of fun working on the site and haven't felt this productive and engaged for a while, maybe ever. 

next time:
- dont build sth that ultimately relies on someone else's data/services
- work on a problem youre passionate about (I did good here)
- find another kick ass name. it gives me a lot of motivation for some reason (I also did good here)

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

## Today To-dos
- [ ] finish key todos before marketing on forums + social media
  - [ ] dynamic metadata
  - [ ] make show page ui better
  - [ ] add buttons (show modal) on artist/venue pages for:
    - [ ] reporting issue
    - [ ] editing
- [ ] add more venues
  - [ ] unplugged sincheon
- [ ] SUPPORT BUSAN (i.e. add city)
- [ ] add back spotify service (have to make toNew artist async prob?)

## CURRENT TODOS
- [x] migrate merge artist stuff
- [ ] explore using system prompt more intelligently (e.g. specifying how i'm going to ask questions and expect number answers, specifying the current date, etc)
- [ ] lol db backup cleanup isn't working
- [x] why do they have 2 artits: https://www.boonwegig.com/en/venues/cafe-idaho
- [x] SEO
- [x] implement concerts/ route
- [ ] implement artists/ route
  - [x] add link on concert page
  - [x] add translations
- [x] implement venues/, artists/ routes
  - [ ] add incomplete icon beside venues and artists that aren't complete
  - [ ] add pagination lol
- [x] add nav bar for venues, artists, and concerts
- [ ] add dynamic metadata to all new routes
  - [ ] maybe change title to glorious gigs galore
  - [ ] and korean to 거대한 기그 군단
- [ ] do some marketing???
  - [ ] reach out on forums
  - [ ] reach out to venues (or just follow them)
    - [ ] make sure you post sth on instagram/twitter beforehand? or maybe after is fine
    - [ ] make sure you have all the "crowdsourcing" tactics in place (e.g. prompting users to send me info)
    - [ ] add a disclaimer somewhere
    - [ ] add social icons at footer
    - [ ] for venues page add some instructions for venues
    - [ ] for artists page add some instructions for artists
    - [ ] MAKE THE FRIGGIN SHOWS UI BETTER
- [ ] IMPLEMENT USER SIGNUPS???
  - [ ] maybe for now just add (contact me if you want to add missing info)
  - [ ] maybe add another table for submissions
  - [ ] think about what other data you want to collect from artists: 
    - [ ] add city col to music artist
- [ ] optimize load times for pages (esp for more info and links on shows page)
- [x] figure out why friggen next dev keeps freezing everytimes there an error
- [x] why doesnt scroll top work for links???
- [ ] can optimize server componetns to fetch async reqs in parallel
- [ ] when i switch between locales on artist page it loads sometimes... shouldn't it be cached? does this have sth to do with client and server components
- [ ] add apple music, twitter, and personal website cols to artist table (maybe facebook)
  - [ ] also a bio column
- [ ] look into messed up bug where reusable musiceventlisting component isn't filtering through fetched events (have to pass sth from parent page)
  - [ ] check venue page
  - [ ] check artist page
- [ ] Arrows for more info look weird on ipad view. Make them shift right
- [x] figure out fonts for korean
- [ ] make translations better (don't just use static and pass via props)
  - [ ] also add tranlsations to genre
- [ ] add dynamic metadata for venues route
- [ ] update genre db values to be stored as UPPERCASE since its an enum
- [ ] go through prod site and double check all posts and record posts that have wack data
  - no time: https://www.instagram.com/p/CznYn9FJ_iL/
  - non-music event: https://www.instagram.com/p/CzIcFrgp0pX/
  - no time: https://www.instagram.com/p/CzBy_n4v3gE/
- [x] scrape ALL seoul venues
  - [ ] check showdeerocks
  - [x] check reddit: https://old.reddit.com/r/koreatravel/comments/13ej8pz/small_music_venues_live_houses/
- [x] add korean translation
  - path should be www.boonwegig.com/lang
  - [x] add language selection in header or footer
  - [ ] can i leverage `next-intl` for timezones..? i feel i don't need to
  - [x] add korean font
    - [x] ~~do hyeon~~
    - [x] 나눔 고딕 코딩
    - [ ] FIGURE OUT HOW TO DYNAMICALLY APPLY FONTS: https://github.com/vercel/next.js/discussions/47309
  - [x] add event tracking for choosing korean vs english url
    - [x] also add event tracking for language selection
  - [x] support local names for rows
- [x] fix FREE flash bug: https://legacy.reactjs.org/docs/error-decoder.html/?invariant=425
  - def has sth to do with new date being diff on server vs client (time where bug was happening: nov 19 4:00am kst -> nov 18 11am pst -> nov 18 7pm utc)
  - date is considered recent on server...
  - event created at: 2023-11-18 01:04:22.579 +0900 -> nov 17 4pm utc
  - ~~changed deployed @~~ NO CHANGE DEPLOYED maybe thats why?
  - but then how is the new event displaying then???
    - oh its because its further down the list so its being called from the db
  - okay i did some testing and confirmed we have static rendering for initial events
  - VERDICT: error is happening b/c we didn't deploy, and since:
    - the event is part of the initial page load
    - the initial page load is rendered statically (i.e. determined at last build time)
    - ...the last build (i.e. deploy) had initial events that were "new" at the time, but no longer are, so when hydrating the client detects that the events are not "new" and thus does not show new + throws an error + shows a flash of server->client text change
      - still not sure how hydration works, i guess even for statically rendered pages js still runs on the client when the page is loaded into the browser (yes this is true i just confirmed)
      - oh so js still is executed at build time too. i guess hydration is more specific to browser js execution (e.g. dom apis etc)
- [x] fix vercel cron deploy
- [ ] db changes
  - [ ] add post timestamp to music even table lol
  - [ ] rename music_event.link -> instagram_link?
  - [x] add an extra status col for scraping (dont use review status)
  - [x] add recommended song link col to artist
- [x] look into seo monitor tool: https://old.reddit.com/r/nextjs/comments/10yc5x5/how_to_make_my_website_search_results_show_up_on/
  - [x] add sitemaps: https://github.com/Mohammad-Faisal/nextjs-sitemap-demo/blob/main/pages/sitemap.xml.js
  - [x] add robots txt
  - [x] look into email you got about failed index
- [x] fix 404 page bug
- [x] i think something similar is happening with error page. prob has sth to do with the locale routing. maybe just move error and 404 to locale/ folder?
- [x] SETUP DB BACKUP (both dev and prod) ❗️❗️❗️
  - [x] if you decide to try things locally might need to fk around with postgres versions and exporting from 14 to 15 dump...
  - [x] maybe just try docker and supabase cli
- [x] figure out genres
  - [x] brainstorm how this ties in with future general event_type + how it ties in with concert genre (dj, club, concert) vs artist genre (rock, punk, etc)
  - [x] implement /admin route and implement basic UI for editing concerts + artist info
    - [ ] make sure this route is not included in SEO
  - [x] delete all genre from db and remove from scraping
  - [x] remove recommended from event and add to artist lol
  - [x] add links to artist youtube search, spotify search, and  to make your life easier
  - [x] capture the following data: 
    - [x] ~~concert genre (add validation)~~
    - [x] artist genre (add col)
    - [x] instagram handle
    - [x] spotify
    - [x] youtube
    - [x] ~~melon (if you see a lot, add col to db artist)~~
    - [x] fix name if its wrong (usually it is)
    - [x] personal recommendation lol (add col to db music_event)
- [x] Create UI on admin route for creating new shows with artists
  - [ ] add button for adding and deleting artists
  - [ ] add local name field to artist
  - [ ] add event type select button (for concert vs club vs etc)
  - [ ] add recommended song link
  - [ ] add page for pending venues (or just edit db directly)
  - [ ] add page for pending music events too
  - [x] maybe add button for deploying? maybe i can just do manually
  - [ ] have to think about how to deal with the fact that our scraper sucks at getting names, so the name check we do for artist existence is 50% going to fail and create another redundant artist row in the artist + event_artist tables. 
    - maybe every new artist gets flagged as "NEEDS_REVIEW"
    - and if the artist is a duplicate, i can search for which artist its a duplicate with and my server action will automatically delete artist from artist table and remap artist in event_artist junction table
    - how will i know if an artist is duplicate? my memory? maybe to help, i can write a query to check for substrings in db and flag artists as duplicate. i can see why the guy had a separate scraping table now
    - and i only do this workflow for new events that were just added (which i should add a flag for in the admin view)
- [x] Double check that new db backup job works
- [x] make page renders dynamic
- [ ] really think about how you want to handle the manual work. and if you really want to do it. and how to scale/automate more. cause reviews/reccs isn't going to be scalable no matter what you do. but its cool
  - scale: crowdsourcing, smarter scraping
- [x] scrape jebidabang gcal and refactor server to be more modular ❗️❗️❗️
- [x] add githook for client build
- [x] figure out UI for genres + rec
- [x] add venue route + page (show location links)
  - path should be www.boonwegig.com/lang/city_name/venues/venue_name
  - [x] in existing migrate script, add sql to auto populate existing columns
  - [x] down and up local db to check
  - [x] add migration to make name + slug non null in venue table
  - [x] add migration to add kakao maps, naver maps, and google maps fields (or maybe just make json col? since diff regions can have diff maps)
  - [x] think about where to put venue link in navbar
  - [x] eventually we should implement /venues page that lists all venues. also clicking on a venue should display the venues shows
  - [ ] add header to concerts section of venue page?
  - [x] convert snake case to came case in venues data json
  - [x] add analytic tracking for map links
- [x] add concerts/ route
  - [x] make id venue name + start date time OR first 5 chars of music event id
    - [x] add slug col to music_event
  - [ ] update event_type = "CONCERT" for all rows in dev and prod
  - [x] no page for concerts/ for now,
  - [x] figure out better ui/ux for the "more info" link  
- [x] add artist/ route
  - [ ] add "no shows..." text or graphic when an artist has no upcomingshows
- [ ] advertise on yonsei via kimyerin 
- [ ] add [city]/ route (support seoul + busan for now)
  - path should be www.boonwegig.com/lang/city_name
  - [x] START WITH BUSAN then move to different timezones
    - [ ] i prob have to do some middleware cookie thing where i keep track of location set... otherwise if i use redirect the client jump is gonna look weird af.
      - [ ] I THINK for now just deal with jump
  - [ ] update busan venues to VALID in prod db
  - [ ] edit i18n message text (have to make dynamic)
  - [ ] update sitemaps, robots txt
  - [ ] have to make sure redirect routing makes sense
  - [ ] edit metadata tags (make dynamic)
  - [ ] investigate
    - [ ] why does url seem sketchy when i click on language link
    - [ ] why does 404 not work
  - [ ] look into how to remove city name from error and 404 pages
  - [ ] HANDLE CITY ROUTING BETTER
    - [ ] i think proper workflow is this:
    - [ ] "/" should be home page with "choose city" selection. header either doesn't exist or doesn't contain links to shows, venues, artists, etc
    - [ ] once user selects city, we can save it in a cookie so we have access to city on server side
    - [ ] the full header can exist in "/city" so it has access to server side
  - [ ] look into why pages are all dynamically rendered now (should still be statically rendered no? i think its cause of the redirect)
- [ ] make scraper smarter
  - [ ] should be able to scrape posts with multiple days
    - [ ] once this is done reach out to venues like club bbang to encourage them to upload posts with text
    - [ ] look into if its valid to handle scraping profiles with multiple links (might not be worth it given that not many profiles do this) https://www.instagram.com/_leson_theson/
- [ ] optimize db queries in client lmao can split them up easily everythings doing too much rn
  - [ ] make queries do the bare minium of what they're supposed to do
- [ ] look into forcing styling to go left for music event. rn its doing it automatically when the text gets long...
- [ ] shoudl somehow make it so when you merge a PR with a migration, it automatically migrates it for you (write gh action)
- [x] look into weird errors you got with the edge function timing out on vercel logs
- [ ] add loading files for every new client route
  - [ ] fix broken animation
- [ ] why is the site breaking on safari? compared to chrome
- [ ] maybe make instagram posts table 
  - [ ] or add some kind of check for name + startdatetime?? idk
- [x] add where clause for music event fetch to only fetch valid events
  - [x] but if you do this you need to be aware that you need to manually approve events.. maybe do this once all fundamental stuff has been handled
  - [x] or maybe for now adjust query so that it only fetches PENDING and VALID events and nothing else
- [ ] AFTER YOU FINISH FUNDAMENTAL CLIENT ROUTE STUFF do monorepo setup ❗️❗️❗️
  - [ ] do repo search for VALID, PENDING, INVALID and replace them with shared ReviewStatus enum
- [ ] read more about seo: https://nextjs.org/learn-pages-router/seo/web-performance/lcp
- [x] why isnt footer at bottom of screen for venue page? Have to scroll down
- Plan of action for crowdsourcing
    - Get a shit ton of users and build clout with venues and artists
        - Can measure this with social media sentiment or something
        - Add a button on artist/venue/concert pages for editing the info (that has to be approved by me first). If you’re getting a lot of edit requests its a good sign you’re building clout
    - Send email/message to venues that you will be allowing users to create accounts to edit their respective venues. This will be a verified system where anyone can make an account, but they can only conduct actions after ive verified that theyre a legit artist or venue + theyre only allowed to edit their own pages.
    - Keep scraping until instagram tells me to stop
- [ ] add a "request access" or "claim page" button to each artist/venue/concert page that allows users to claim pages for CRUD permissions.
  - [ ] add a note too to explain what it means ❗️❗️❗️
  - [ ] can put like faded images of spotify, youtube, linktree, melon, genie, soundcloud, etc prompting people to fill them in
- [ ] Permissions brainstorm: https://chat.openai.com/share/da484370-9bb6-4758-a9a8-f35ceefe06c8




## Scraper TODOs
- [ ] maybe rename musicevent -> concert (both on client and scraper)
- [ ] add createdat and updated at cols for many-many tables
- [ ] look into moving scraper to github action. main blocker are files i persist across runs (e.g. cache, logs)
  - [ ] justify if this is worth the costs i'm spending on vps
  - [ ] look into aws or 3rd party cloud caching service?
  - [ ] can create venue scrape job on gh actions too (since the two jobs can share cloud cache)  
  - [ ] maybe for ease of use, just store cache on github lol
- [ ] maybe move backups and supabase files to root
- [ ] double check db cols for cols you want to make non-null
- [ ] scrape for 18+? maybe only for english venues
- [ ] city scrape list (search reddit!!!)
  - [ ] Albuquerque lmao: https://old.reddit.com/r/Albuquerque/comments/zznli0/how_likely_are_you_to_seek_out_local/
  - [ ] vancouver
  - [ ] busan
- [ ] music_event should be music_show
- [x] add server analytics (i want to see similar stats to what i saw on heroku) ❗️❗️❗️
  - [x] https://vercel.com/analytics?
- [x] setup vercel deploys (instead of pushing empty commits from vps): https://chat.openai.com/g/g-fylG5LcKT-full-stack-dev-apiana-framer-v2/c/e0dfd62c-0f13-4fb7-aa82-d88e15c3d8a3 ❗️❗️❗️
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
  - [x] figure out workflow for cloud migration (maybe i just run it locally and connect to prod db)
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
  - [x] create a boon we gig gmail account
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
  - [x] investigate why logs aren't always written to file (maybe im logging too much)
  - [ ] DO LATER
- [x] double check what to do with isFree flag. maybe we make this NON NULL too. 
  - [ ] also check how it works with donation text
  - [ ] DO LATER
- [x] look into pnpm? or switch back to npm
- [x] set up vps (for scraper) ❗️❗️❗️
  - [x] setup deployment scripts
  - [x] maybe adjust date format for logs (mght be weird with timezones and logging going across diff days. maybe a unique log file for every run?)
  - [x] make sure dates are okay when setting on vps
- [x] set up cron jobs ❗️❗️❗️
  - [x] delete rows in prod db
  - [x] migrate dev to prod
  - [x] make sure scraper db is pointing to prod supabase.
  - [x] double check how we can handle dates, we might need to use a date library or do some kind of country code check to make sure that we're storing correct timezones
  - [x] double check cron logs + email + sentry
  - [ ] double check dates for any new db rows
- [x] write script that'll print out all needs_review rows for all tables (maybe write sql for db beaver)
  - [x] check how easy it is to edit stuff in db beaver
- [x] see how painful it is to manually check things
- [ ] figure out db backups ❗️❗️❗️
  - [ ] prod: 
    - [x] https://supabase.com/docs/guides/platform/backups
    - [ ] https://supabase.com/docs/reference/cli/supabase-db-dump
    - [ ] https://supabase.com/docs/guides/cli/github-action/backups
    - [ ] or maybe just run psql script locally
  - [ ] dev: just create cron job to run pg_dump every 24 hrs
- [x] figure out how to handle logs when you deploy your app
  - [x] don't need to write to file prob (maybe only for scraper)
  - [x] how to handle errors. saving stack traces to files doesnt sound great (too big) im just console erroring alongside logger.error for now
  - [x] keep logger file writing for development, it's pre helpful
- [ ] in chatgpt prompt add logic that checks for @ (means its an insta username)
- [ ] look into finetuning: https://platform.openai.com/docs/guides/fine-tuning/preparing-your-dataset (more expensive tho)
- [x] fix time problems again sigh... go through localhost and look at bottom events where they're set 2025. these mostly seem invalid
- [x] when you finally scrape instagram_id for the initial scraped venues, turn the column NOT NULL 
- [x] find better way to handle error logging crap 
  - [x] my error utils method isn't perfect for complicated errors and winston doesn't like it. would be cool if i could just pass in error to winston logger instead of doing all this json nonsense
- [ ] do another sanity check on localhost frontend just to see that things make sense (e.g. artists being properly tagged, names make sense, dates make sense, links make sense)
- [x] maybe worth making custom errors for chatgpt invalid parsing cases (we can store these in the cache too?)
- [x] double check dates 
  - [x] when we get a date col from the db, the js date object we get is UTC-ified or at least knows about the timezone (im worried that the physical location of the server the db lives on will affect the date that's queried)
- [x] lol a lot of instagram names still aren't great, might need to do things manually
- [x] look into the datadog logging for backend you did or wahtever it was called
- [x] concert type isn't always accurate, maybe leave it out for now?
- [x] double check if sentry error handling is okay (maybe logging too much)
  - [x] look into how deep sentry can print extra data
- [ ] maybe we should actually store invalid events in the db (not every post, just the events that are invalid like the duplicate post ones: https://www.instagram.com/p/Cyss2CsxeHj/)
  - [ ] and then we can just flag as INVALID for review_status or sth?
- [x] look into flushing logs after a certain time for scraper
- [x] maybe simplify timestamp setting process in db by only storing UTC values
  - [x] in prod it does this automatically, but locally it doesnt... maybe just delete all timezone logic and let client handle it (which makes sense, and the source of truth for timezones can always come from the venue city/country)
    - [x] actually wait no, we need to specify the timezone offset lol, since instagram posts themselves don't have them.
- [x] setup custom domain 
  - [ ] uh remove my personal information from contacts??? search in chatgpt whether if its safe: https://ap.www.namecheap.com/domains/domaincontrolpanel/boonwegig.com/domain#/editcontacts
- [ ] optimize scraping frequency
  - [ ] maybe we dont have to do everyday. maybe we only do everyday for certain accounts that post often
  - [ ] maybe longterm we can add some kind of detection that if an account posted a lot in a certain period of time, we will flag them to increase scraping frequency
  - [ ] also maybe we can optimize the scraping **time**, since different cities in diff timezones. prob 1-3am local time is good.
- [x] change cache ttl for dev vs prod, dev should be long (maybe doesnt exist at all) and prod should be short
- [ ] actually look into adding and scraping vancouver venues asap, they post like crazy wtf ❗️❗️❗️
  - [ ] https://www.instagram.com/p/CzUFoHULILL/ date edge case where year isn't posted but its obviously for next year
    - parsed data: {
  "startDateTime": "2023-02-17T00:00:00Z",
  "isFree": false,
  "musicArtists": ["The Free Label"]
      }
    - [ ] will likely need to make date infer method smarter
  - [ ] also a lot of them just post "tonight" as the day
  - [ ] have to consider how to handle case where single day and **ticket** sale time is posted
  - [ ] is it even worth scraping data for events that are happening 3+ monoths from now if theyre just gonna advertise it again
  - [ ] theres literally 0 point in advertising events that are happening tonight i just realized lol maybe can add a prompt for this here (eg is event happening today)
    - [ ] seems like a lot of vancouver venues do this style of advertising on instagram
  - [ ] OR maybe we can have different style prompts for different countries/cities
  - [ ] write chatgpt tests before you do this
  - [ ] HARDEST THING TO DETERMINE is date and time. how to handle situation where ticket and event start date times are included in same post (so many edge cases)
- [ ] for final stats print, don't print out all venue names just the ones that actualy had events added
- [ ] consider making city all lowercase to be consistent (in timezone its lowercase, everywhere else its proper case)
- [ ] refactor venues.json to be array of objects instead
  - [ ] so we can add metadata like reviewStatus
- [x] add localName col to venue and artist (so they have their name in their local language)
- [x] write cron job for auto push on vps (so that ui can be refreshed lol)
- [ ] write migration to add external_map_json col to venue
  - think json is the right call here given that there could be an arbitrary number of external maps (e.g. korea has kakao, naver, google)
- [x] scrape more venues in seoul ❗️❗️❗️
- [ ] consider refactoring some code to not use classes... never thought about bundle sizse
  - [ ] this is moreso an issue for frontend code. once you do monorepo stuff you should make sure all your shared code doesnt use classes and individual exports. you can use the `import * as Helper from ...` syntax to let you still use namespaces
- [ ] think about how to handle scraping festival events... or just posts with multiple days in general...
- [ ] consider scraping genre (can ask another prompt) and displaying this in the ui for each event
  - [ ] maybe we can be clever and use a combination of artist spotify genres + instagram post text + chatgpt to give us the genre
  - spotify genre is prob a no go given how infrequent they are in the db 
- [ ] look into doing smarter artist parse in chatgpt (separate prompt)
  - e.g. ask for the full name, instagram username, local name
- create better abstraction for chatgpt service (can prob split into chatgpt layer + extraction layer)


##  Frontend TODOs
- [ ] cant tell if yellow for free and text-secondary and thumb are same 
- [ ] ui for concert page sucks
- [ ] when there are a lot of events for single days, its a little hard to distinguish from other days sometimes. think of how you can make each music-group more distinct
  - can get fancy and make groupd ate scroll with scrollbar
  - can be simple and just make each group pop out somehow
- [ ] setup env variables and make pr environemnt work for vercel deploys
- [ ] "gigs galore" sounds cool and can prob be used somewhere
- [ ] double check youtube url channel types:
  - [ ] https://www.youtube.com/channel/UCoqClQfM69heXh3VjiHq_Bw
  - [ ] theres one with @
- [ ] add translations for error and 404 routes
  - [ ] https://next-intl-docs.vercel.app/docs/environments/error-files
- [ ] artist route
  - [ ] i think should do only when we either onboard users onto site OR figure out how to deal with unstructured data in instagram posts (rn theres prob a lot of instances of similar but diff artists parsed by chatgpt)
    - [ ] maybe can search by instagram username + local name in db during existence check
- [ ] redesign header (with venue, about + cities in mind)
- [ ] make tooltip appear on 
  - [ ] dates
- [ ] optimize db query (or rather, benchmark and see)
  - [ ] think we should consider not casting venue to an object, and just add first class fields to the clientmusicevent class
- [ ] add 404 page
- [x] delete icon svgs !!!
- [x] the loader seems to move a div above or sth, check by adding a wait
- [x] see if you want to move from self hosted -> cloud for umami
- [ ] add a report button? for inaccurate content?
- [x] look into tiny analytics, https://www.simpleanalytics.com
- [x] add a disclaimer about concert accuracy
  - [ ] should be fine for now, maybe revisit
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
  - [x] add a "last edited" footnote so people are aware of updates
- [ ] think about how you want to handle displaying artist info
  - [ ] sending to another page seems annoying, but hover tooltip won't work well on mobile
- [x] make mobile friendly❗️❗️❗️
- [x] make font smaller, bigger font looks more unprofessional for some reason. just compare with oh my rockness
- [x] add translation for korean (i wanna show title in korean + dates and stuff too)
- [x] add analytics ❗️❗️❗️
- [x] fix date issue ❗️❗️❗️ (SSR vs client components)
- [ ] add a disclaimer that not all the information might necssarily accurate and that the event link should be double checked directly
- [ ] look into analyzing bundle sizes. mainly the use of "use client" client components and not. (e.g. try making EventDate a server component and comparing the difference in bundle size)
- [ ] double check client errors in browser console on dev envrionemtn
- [x] figure out date rendering (have to do some client rendering bs)
- [x] look into caching issues aka make site dynamic rendered
  - [x] https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server-with-third-party-libraries
  - [x] seems like even when our db contents change, the site doesn't update dynamically meaning it's prob using cached data somewhere
  - [ ] https://old.reddit.com/r/nextjs/comments/16owd95/i_think_im_ready_to_cry_how_in_gods_name_do_you/
  - [x] maybe just deploy once everyday after scrape completes lol. will get to keep benefits of static rendering
- [ ] add city filter ❗️❗️❗️
  - [ ] prob have to add routing for different cities
  - [ ] path should be boonwegig/[city]/[event_type] 
  - [ ] rmb to go back to database and check invalid venues that we can now switch to valid
- [x] add venue link (with cute location icon or sth)
- [x] make day in the month/day text double digit (e.g. 01 instead of 1)
- [x] implement pagination ❗️❗️❗️
- [x] figure out how to make separation between different events clearer (look at reddit and hackernews)
- [x] maybe look into centering things better
- [x] fix detailed styling issues
- [ ] support spotify links
- [ ] maybe add PRIDE tag
- [x] try the cool ui where events are grouped by date (i.e. we only show one date for multiple rows)
- [ ] make githook for client
- [x] maybe add disclaimer for dates being based in the city, not the browser time settings
- [x] seo https://github.com/garmeeh/next-seo
- [x] look into using next/script insteaed of normal html script
- [ ] add event tracking with umami
- [x] add contact info with email ❗️❗️❗️
- [ ] add venue route with location info
  - [ ] add location links (google maps, kakao maps, naver maps) ❗️❗️❗️
- [x] SEO nextjs: https://nextjs.org/learn/dashboard-app/adding-metadata
- [ ] double check why renders happen twice (or just check client react renders in general)
- [ ] heres a problem... is too much data bad? showdeerocks is a great resource but it gets hard to navigate through the noise when theres a bajillion things going on. i need some kind of FILTERING
  - current filter ideas: event_type, city
  - since we're focusing on concerts... how about genre
    - or not genre... music event type? classical vs concert vs dj
  - how about highlighting concerts close to the user? if i can get their location...
- [x] ADD LOADING STATE TO LOAD MORE BUTTON ❗️❗️❗️

## Post-MVP todos
- [ ] scrape other cities bb
  - [ ] start with van
    - [ ] look at venues dacey performed at and go from there lol
  - [ ] canada: toronto, calgary, montreal
  - [ ] look into colleges too, theres prob ample places that have public performances
- [ ] look into supporting other gig types
  - [ ] art shows, comedy, theatre, dance, clubbing, circus, film, fashion shows 
  - [ ] maybe even non-gigs like thrift shops, instrument shops, recording studios,  merchandise producers, record stores (maybe just having a list of them is nice)
- [ ] look into monetisation
  - [ ] venue ads
  - [ ] artist ads
  - [ ] normal ads (blah)
  - [ ] affiliate links (possible)
    - [ ] consult people and chatgpt on how to approach this... it's possible that i should only be showing/scraping venues that have paid me... definitely not at the beginning
    - [ ] i think if i want to charge venues for having shows on my site it'll definitely have to be after I get a significant amount of street-cred + ill still have to have a free tier (and ideally making this tiering system additive and not removing anything major from those accounts who want to stay in the paid tier)
    - [ ] maybe the business model is manually putting ticket links and getting paid commission if the ticket purchase came from my page
    - [ ] see how you can strip features to their most basic use (for future monetisation opportunities yeesh i feel kind of scummy lol)
    - [ ] MAYBE the killer feature for a subscription system is this: having a form that can be autopopulated by chatgpt by having the venue user copy paste their instagram post text into it. then they can double check their info before uploading too. hmmmmMMMMMMMMMMMMM 👑👑👑 maybe im just exhausted rn lmao
      - [ ] it's kind of like a step down in terms of pure automation (e.g. no longer scraping) but a step up in terms of data quality with the extra pair of human eyes
      - [ ] could let users try once to see if they like it as a trial. this would be easy to track since they'll have made an account at this point and they wont be able to abuse it
      - [ ] could also add extra validation and highlight fields that might've messed up (e.g. date is weird, price is weird, etc)
      - [ ] can also still support csv imports
- [ ] Look into monorepo setup
 
## Marketing TODOs
- [ ] advertise on korean reddit
  - [ ] https://m.fmkorea.com/5976148244/5976226120#comment_5976226120
- [x] advertise on facebook
  - [ ] https://www.facebook.com/groups/507433196082647?hoisted_section_header_type=recently_seen&multi_permalinks=2612855912207021
- [ ] reach out to local music ppl via insta/email
- [x] ADVERTISE ON REDDIT ❗️❗️❗️ (maybe use utpamas account)
  - [x] https://np.reddit.com/r/koreatravel/comments/13ej8pz/small_music_venues_live_houses/jjq5znb/
  - [x] https://www.reddit.com/r/Living_in_Korea/comments/17qfzv1/are_there_any_websites_where_you_can_check_if/
  - [ ] post on living in korea subreddit, korea punk subreddit, any other ones you can find
- [x] before site is formally deployed, reach out to organizers and ask them if its okay to scrape data from their accounts... or maybe not and say fuck it ill do it myself.
  - yeah do first apologize later.
- [x] Figure out SEO
- Maybe the goal is to get people creating accounts on my platform... mainly to get them to fix all the inaccurrate info thats bound to appear lol
  - okay so lets think of the workflow:
    1. artist/venue/attendee sees inaccurate info on site
    2. they want to change it
    3. i can either have them report it to me so i can change it, or i can let 


## Notes

### Instagram post examples:
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

### URL brainstorming
```
e.g. https://www.boonwegig.com/en/seoul/venues/cafe_idaho
base: /lang/[city_name] ✅
  or  /lang/ 
extensions:          /[event_type]/[event_id] ✅ (e.g. concerts, art_show) 
                     /venues/[venue_name] ✅
                     /[performer_type]/[performer_name] ❓ (e.g. music_artist, artist, comedian) 
                     /artists/[artist_name] ✅
query params:        ?genre="rock"
```

### Next.js
- SSR vs Client rendering (i.e. render on server vs client)
  - 2 types of SSR: Static vs Dynamic rendering (i.e. render at build time vs on request)

### User Workflows

**Concert workflow**
- Open site
- See what concerts are happening this week
- Check out free concerts ✅
- Check out concerts with genres that are interesting to me ❗️
- (don't check out artists i know b/c i'm probably following them already on social media and know if they're playing or not)
- Once i find a concert that interests me:
  - preview artist genre/music somehow ❗️
  - click on instagram link to see details ✅
  - click on venue to find location ❗️

**All events workflow**
- Open site
- See what events are happening this week


### Genres
- Rock - 록
- Pop - 팝 
- Hip Hop/Rap - 힙합/랩 
- Jazz - 재즈 
- Blues - 블루스 
- Classical - 클래식
- DJ 
- Country - 컨트리 
- Metal - 메탈 
- R&B/Soul - 알앤비/소울 
- Reggae - 레게 
- Folk - 포크
- Indie - 인디
- Latin - 라틴 
- Punk - 펑크 
<!-- - Disco - 디스코   -->

### Music Event Types
- Concert
- Festival
- Club
