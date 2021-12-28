# mkd-blog Development Documentation.

# What is mkd-blog? Aim/Outcome/Intro

---

mkd-blog short for **Markdown Blog** is a blogging platform where anyone can share their articles they write to the world. The editing platform of the mkd-blog is bidirectional, i.e. raw articles can be written in text and converted into HTML & Markdown, simultaneously, articles written in Markdown is also converted into HTML and Text. 

Users with or without the knowledge of Markdown can use the platform to create articles and share it in a decorated manner. 

# Tech stacks Used

---

## Frontend

|                      HTML |                         CSS |                          JS |
| --- | --- | --- |
| To build the structure and layout of the website.  | To style the website to provide a reasonable user experience. | To add the core functionality of the project into the website. |

## Backend

|           Nodejs and Expressjs |                      MySQL |                         EJS |
| --- | --- | --- |
| To create the server side application that will run the logic of the mkd-blog.  | Database management system to manage data associated with the mkd-blog. | To create dynamic pages easily and to manage small components of mkd-blog.  |

## APIs Used

|                                   Axios |
| --- |
| Axios is used to make the required requests to the server as it offers easy to use methods for direct communication and data exchange. |

## Version Control

|              Git |             GitHub |
| --- | --- |
| To track different versions of code in the local system. | To collaborate with team and have a track of code of all members across a single platform |

## Hosting Details

|                          Server at Heroku |                       MySQL at (to be decided) |
| --- | --- |
| Heroku is used to keep the server side up and running 24/7 and serve the application to the end user. | (To be decided) |

## Other Technologies Used

| TailwindCSS | Rebrandly API | EditorJS |
| --- | --- | --- |
| Using tailwinds utility classes to create mockup in a quick and reliable manner. | To create short URLs for all articles.  | EditorJS used UI to edit text as per user requirements and allow to save and edit for later. Make it easier as we don’t have to implement our own text editor. Other than one for Markdown. |

| SASS (Syntactically awesome style sheets) |
| --- |
| SASS to organize styles and keep track of project related variables in a more organized manner |

# mkd-blog Features

---

## Core Feature

<aside>
💡 Users can write their articles in plain text or Markdown and can easily share it to the world with a simple link.

</aside>

## Minimum Viable Product (MVP)

1. Signup and Sign-in for Users.
2. Edit user profile page.
3. Create New Articles.
4. Update Existing Articles. (belonging to that user)
5. Delete Existing Articles. (belonging to that user) 
6. Read a article in a single page.
7. Like a article.
8. Follow a author.
9. Add Comments to an article. 
10. Display existing articles in the homepage.

## Additional

1. Save articles for later or Read Later Option.
2. Use Rebrandly API to create short URL’s or articles and use that to share the articles.  
3. Archive written articles. 
4. Allow Tags/Categories for articles. 
5. Like a comment. 
6. Implementing Editor.js to create easy to use Text Editor. 
7. Light and Dark Mode Toggle Feature. 

# mkd-blog Core Logic and Maintenance

---

## Logic

## Database Schema

- v1.0 as on
    
    [https://www.notion.so](https://www.notion.so)
    
    ```sql
    
    ```
    

# UI/UX Layout

---

## Color Scheme Used

## Typography

## Design Inspiration

- Layout Desktop
    
    [Blogging Platform](https://dribbble.com/shots/14623461-Blogging-Platform?utm_source=Clipboard_Shot&utm_campaign=yugalmahajan&utm_content=Blogging%20Platform&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=yugalmahajan&utm_content=Blogging%20Platform&utm_medium=Social_Share)
    
    [Blog Resoures & Reading Page: Felix](https://dribbble.com/shots/15418047-Blog-Resoures-Reading-Page-Felix?utm_source=Clipboard_Shot&utm_campaign=oguzyagiz&utm_content=Blog%20Resoures%20%26%20Reading%20Page%3A%20Felix&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=oguzyagiz&utm_content=Blog%20Resoures%20%26%20Reading%20Page%3A%20Felix&utm_medium=Social_Share)
    
    [Fintory Blog](https://dribbble.com/shots/15006128-Fintory-Blog?utm_source=Clipboard_Shot&utm_campaign=julianherbst&utm_content=Fintory%20Blog&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=julianherbst&utm_content=Fintory%20Blog&utm_medium=Social_Share)
    
    [InHype travel](https://dribbble.com/shots/13929880-InHype-travel?utm_source=Clipboard_Shot&utm_campaign=newsann&utm_content=InHype%20travel&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=newsann&utm_content=InHype%20travel&utm_medium=Social_Share)
    
- Layout Mobile
    
    [Travel Agency Website - Mobile concept](https://dribbble.com/shots/14311458-Travel-Agency-Website-Mobile-concept?utm_source=Clipboard_Shot&utm_campaign=farzanfaruk&utm_content=Travel%20Agency%20Website%20-%20Mobile%20concept&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=farzanfaruk&utm_content=Travel%20Agency%20Website%20-%20Mobile%20concept&utm_medium=Social_Share)
    
    [Mobile Blog Patterns](https://dribbble.com/shots/16166201-Mobile-Blog-Patterns?utm_source=Clipboard_Shot&utm_campaign=beatrizfialho&utm_content=Mobile%20Blog%20Patterns&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=beatrizfialho&utm_content=Mobile%20Blog%20Patterns&utm_medium=Social_Share)
    
    [News App Design UI/UX](https://dribbble.com/shots/14905782-News-App-Design-UI-UX?utm_source=Clipboard_Shot&utm_campaign=rakibkowshar&utm_content=News%20App%20Design%20UI%2FUX&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=rakibkowshar&utm_content=News%20App%20Design%20UI%2FUX&utm_medium=Social_Share)
    
    [Blog](https://dribbble.com/shots/9713479-Blog?utm_source=Clipboard_Shot&utm_campaign=Tatarenko&utm_content=Blog&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=Tatarenko&utm_content=Blog&utm_medium=Social_Share)
    
    [News App I Ofspace](https://dribbble.com/shots/15837942-News-App-I-Ofspace?utm_source=Clipboard_Shot&utm_campaign=ofspace&utm_content=News%20App%20I%20Ofspace&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=ofspace&utm_content=News%20App%20I%20Ofspace&utm_medium=Social_Share)
    
    [Blog App Concept](https://dribbble.com/shots/10846460-Blog-App-Concept?utm_source=Clipboard_Shot&utm_campaign=anik117&utm_content=Blog%20App%20Concept&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=anik117&utm_content=Blog%20App%20Concept&utm_medium=Social_Share)
    

# mkd-blog Worked With

---

| Role | Name | Contact |
| --- | --- | --- |
| Team Lead | Kunal Keshan | kunalkeshan12@gmail.com |
| Vice Team Lead | Himanshu | hq4313@srmist.edu.in |
| Developer | Sitanshu Pokalwar | sitz2309@gmail.com |
| Developer | Sahil Kumar | official.sks547@gmail.com |
| Developer | Krishna Chaitanya Thota | kt0731@srmist.edu.in |
| Developer |  |  |
| Developer |  |  |
| Developer |  |  |

# Links To Project

---

## Github

[https://github.com/kunalkeshan/mkd-blog](https://github.com/kunalkeshan/mkd-blog)

## Site (Work in Progress)

[https://www.notion.so](https://www.notion.so)

## Quick Links

📨 Bitly Mini Link to this Documentation: [https://bit.ly/mkdBlogDevDocs](https://bit.ly/mkdBlogDevDocs)
