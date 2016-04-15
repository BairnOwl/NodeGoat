<a href="https://heroku.com/deploy">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

A1:
Handled Server Side JS Injection by adding checking to the input. Change "eval()" to parseInt() and also used "use strict". Thus the server could not be shut down by sending a "process.exit()" or "process.kill(pid)". Only numbers could be allowed.
Did not handled the SQL injection because there is no way to connect to the mongoDB directly.




A2:

Protecting user credentials by hasing the user passwords instead of just directly storing the passwords. 
Password Guessing Attacks handled by requiring more complex passwords. Also, when the user tried to force guessing, warn "invalid username/password" instead of specially telling which one is not valid.



A3:

 HTTPOnly flag for session cookie while configuring the express session to avoid XSS attack.


A4:




A5:






A6:




A7:





A8:





A9:







