This is a web app to record fx trade details including plan and results.

How to start

```
Install mongodb (currently using version 3.6)

cd {PATH_TO_MONGODB} (for example, MongoDB/Server/3.6/bin)

mongod (this will start mongodb using default dbpath)

download this project to local.

cd fx-logger

npm install

node app.js
```

<hr>

Future goals:
```
  also save screenshots into DB.
  
  add login feature to protect data.
  
  make use of api (maybe MT4 or oanda provides) to automatically send trade data to my app.
  
  etc...

 ``` 
Hope one day can release this to help all fx lovers!
  
