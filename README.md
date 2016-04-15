<a href="https://heroku.com/deploy">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

A1:




A2:




A3:




A4: in allocations.js, I changed the line "var userId = req.params.userId;" to "var userId = req.session.userId;" so that malicious users cannot go to other people's allocation by changing the url.



A5: To prevent security misconfig, I disabled x-powered-by header, hide default session cookie names by setting key attribute, use helmet middleware to restrict access to important information. 






A6:




A7:





A8:





A9:







