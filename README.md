# final-project-proposal-krdh
final-project-proposal-krdh created by GitHub Classroom

484 Final Project Write Up 
What does your application do?
- For our 484 project, we’ll be working with a Dr. Derick D. Jones Jr (https://www.linkedin.com/in/derickjones/), 
  who’s a professor of chemistry at Columbia College. For his chemistry lab, he specified that he needs a web app where he could post notes, 
  articles, grades, and updates to his students. Users would be able to make an account as a student or as an admin. 
  The admin (who would be Dr. Jones), would be able to create posts and students would be able to interact with the posts and possibly comment.

What makes it different than a CRUD app? I.e., what functionality does it provide that is not just a user interface layer on top of a database of user information, and the ability to view / add to / change that information?
- For this part we will need to meet with Dr.Jones this week to get the full details of what he needs.
  All he described in a short conversation was that he needed a basic CRUD app for his chemistry lab, but we can expand on this idea after talking to him more. 
  There are likely some specific things he needs that would make our web app unique. 
  If that’s not the case, we can do something interesting with APIs that could help students in their labs or do something interesting with grade data/lab data. 

What security and privacy concerns do you expect you (as developers) or your users to have with this application?
- Cookies - We can use cookies for session management to keep the admin and students logged in. Cookies come with a host of vulnerabilities. We need to ensure cookies are encrypted so they can’t be attacked using things like HttpOnly.
- Cross Site Scripting (XSS) - This can occur as we may allow users to write and post content. If our fields are unfiltered, an attacker can post malicious JavaScript and HTML content to steal data like tokens, cookies, logins, and other sensitive information.
- Cross-site Request Forgery Attack - If we pull content from other sources we need to be careful about malicious websites that could potentially initiate malicious actions. We’ll likely apply the Same Origin Policy.
