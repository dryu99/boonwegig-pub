# EventGong

TODOs
- [x] create models in db for venues and artists. The idea is that we want to catalog all indie venue and artist info in a database and will update and collect data gradually.
- [x] handle case where chatgpt output returns an array (i.e. a single post advertised multiple events)
  - [x] also how do i handle scenario where insta post pre-promotions e.g. theyre advertising an event but dont have enough details yet 
    - i don't think it makes sense to add to the db. why advertise an event if you dont even know what time its gonna be at. we should ONLY COLLECT FULLY SCHEDULED EVENTS 
- [x] figure out how to reduce chatgpt costs
- [ ] handle venue location address in data extractiobn?
- [x] handle donation ticket case for price
- [x] add city and country to venue model
- [ ] save some data from showdeerocks and validate schemas are okay (just pick a few, too many venues rn and they dont have insta ids)
- [ ] fix logger
- [ ] review chatgpt prompt. try to optimize and figure out how we can track logs of responses from it
- [ ] come up with chatgpt cost calculator for my usage
  - right now it's about 5 cents per post? double check  
- [ ] do an initial scrape!!!
- [ ] set up vps
- [ ] set up cron jobs
- [ ] write script that'll print out all needs_review rows for all tables (maybe write sql for db beaver)
  - [ ] check how easy it is to edit stuff in db beaver
- [ ] see how painful it is to manually check things
 

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
