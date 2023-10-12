# BoonWeGig

TODOs
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
- [ ] clean up data in venue table in db. only handle seoul shows for now
- [ ] do an initial scrape!!! (use db venues not json delete that)
- [ ] set up vps
- [ ] set up cron jobs
- [ ] write script that'll print out all needs_review rows for all tables (maybe write sql for db beaver)
  - [ ] check how easy it is to edit stuff in db beaver
- [ ] see how painful it is to manually check things
- [ ] figure out db backups + storing in cloud
 

Notes
- i should have a personal guideline for scraping phase that i won't go 110% to collect data that is unreasonably difficult to collect e.g. only in image
- possible for instagram posts uploaded to be promotions but contain no data because its all in the photo. you can infer these empty event promotions from non-promotion posts via the props
- a lot of phase 1 is just going to be finding edge cases with posts and making the prompt smarter


Edge case examples:
- post with full data: https://www.instagram.com/p/CxZz_PgJXkt/
- post with multiple events: https://www.instagram.com/p/Cxw_37brAPc/
- post with donation text: https://www.instagram.com/p/Cx5ZJfRrGNS/
- post not advertising anything (but subtle): https://www.instagram.com/p/Cx-nt3-JsH-/
- post really not advertising anything: 
- DJ example: https://www.instagram.com/p/Cx4xTQORHFT/
- art example: https://www.instagram.com/p/CxpeoFHO7xc/
- FIND EXAMPLE THAT IS MISSING DATA BUT IS VALID EVENT
