# Music Organizer
The future of music library management

## How do I use this?

You can access the working application on [music.zolp.dev](https://music.zolp.dev). If it is not working, it's probably because Supabase froze my project due to inactivity so send me a quick email and I will start it again. 

## Development

For developing MusicOrganizer, I would recommend using the Supabase free tier and hosting your test project there. For the database schema, please view the [schema.dbs](/schema.dbs) file and create a database schema similar to that. Personally I would not recommend cloning the schema directly to Postgres (since there are a few differences between the written out schema and the functional schema running on our servers), but you can try that as well. Ensure that you remove the underscores in front of the columns if you do clone it directly to your database. 

 > PLEASE NOTE: The schema file DOES NOT include any of the RLS policies. The fact of the matter is that my RLS developing skills are subpar, and I don't want to be responsible for someone taking my RLS policies and getting hacked because I did something wrong. If you are new to the development world and you need some help making your own RLS policies, please feel free to contact me and I'm sure we can work something out. 

For the rest of the development environment, this was built in NextJS so you can run it like any other NextJS project. The easiest way to get up and running is to install [NodeJS](https://nodejs.org/) and install Yarn in the terminal (`npm i -g yarn`). Once you've done this, you can install all of the dependenceies with

```
yarn
```

and run the development environment with

```
yarn dev
```

There are also some environment variables that you have to define, which you can do by renaming the ".env.local.example" file to ".env.local" and then defining the environment variables.

If you have any issues, please feel free to contact me at the email listed on my Github profile or any of the methods listed on my [website](https://dannyzolp.com/). 
