<a href="https://heroku.com/deploy">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

URL: http://cs132security-group20.herokuapp.com/

A1:
Handled Server Side JS Injection by adding checking to the input. Change "eval()" to parseInt() and also used "use strict". Thus the server could not be shut down by sending a "process.exit()" or "process.kill(pid)". Only numbers could be allowed.
Did not handled the SQL injection because there is no way to connect to the mongoDB directly.




A2:

Protecting user credentials by hasing the user passwords instead of just directly storing the passwords. 
Password Guessing Attacks handled by requiring more complex passwords. Also, when the user tried to force guessing, warn "invalid username/password" instead of specially telling which one is not valid.



A3:

 HTTPOnly flag for session cookie while configuring the express session to avoid XSS attack.


A4: Insecure DOR 

In allocations.js, I changed the line "var userId = req.params.userId;" to "var userId = req.session.userId;" so that malicious users cannot go to other people's allocation by changing the url.



A5: Misconfig 

To prevent security misconfig, I disabled x-powered-by header, hide default session cookie names by setting key attribute, use helmet middleware to restrict access to important information. 


A6: Sensitive Data


A7: Access Control

This attack happens when an attacker directly inputs a URL that they should not be able to access (e.g. an admin level function). The server is vulnerable if it does not check for authorization, so I added some code to check if a user has proper authorization before being able to access a webpage.


A8: CSRF

Cross-site request forgery occurs when a user uses an attacker's website and the site sends a forged HTTP request to the victim application with the user's cookie and authentication. I prevented this attack by using the CSRF module to check for the existence of a validated token.


A9: Vulnerable Components

Using components such as libraries, modules and frameworks could be problematic if they have vulnerabilities. This could be prevented by not allowing an application to run with root privileges, amongst other cautions.

A10: Redirection

Redirection occurs when links are unvalidated and attackers can redirect users to malicious websites. It could be prevented by validating the URL, not involving user parameters, or simply avoiding redirection.




