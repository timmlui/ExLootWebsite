mongoimport --db database --collection posts --drop --file posts.json

curl "http://localhost:3000/filter?location=mississauga"

read -p $'\nCreate post'
curl -X "POST" "http://localhost:3000/post" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "category": "book",
  "price": 300,
  "title": "Single Variable Calculus",
  "description": "not fun",
  "location":"toronto",
  "date":"2017/03/16",
  "posterID" : 1
}'

read -p $'\nCreate post'
curl -X "POST" "http://localhost:3000/post" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "category": "book",
  "price": 100,
  "title": "Multi Variable Calculus",
  "description": "not fun",
  "location":"mississauga",
  "date":"2018/02/12",
  "posterID" : 2
}'
read -p $'\nCreate post'
curl -X "POST" "http://localhost:3000/post" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "category": "electronic",
  "price": 1000,
  "title": "something expensive",
  "description": "not fun",
  "location":"scarborough",
  "date":"2019/03/16",
  "posterID" : 3
}'

read -p $'\nEdit post'
curl -X "PUT" "http://localhost:3000/post/1" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "category": "electronic",
  "price": 555,
  "description": "all 5s"
}'

read -p $'\nDelete post'
curl -X "DELETE" "http://localhost:3000/post/2" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{}'
     
read -p $'\nCreate post'
curl -X "POST" "http://localhost:3000/post" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "category": "electronic",
  "price": 1000,
  "title": "something cheap",
  "description": "not fun",
  "location":"scarborough",
  "date":"2019/03/16",
  "posterID" : 4
}'

read -p $'\nSearch Calculus'
curl "http://localhost:3000/search/Single+Variable+Calculus"


read -p $'\nSearch cheap'
curl "http://localhost:3000/search/cheap"

read -p $'\nGet users posts'
curl "http://localhost:3000/users/1/info" \
	-H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" 
     
read -p $'\nGet one specific post for rating'
curl "http://localhost:3000/posts/1" \
      -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es"

read -p $'\nUpdate seller rating'
curl -X "PUT" "http://localhost:3000/rating/1" \
   -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
   -H "Content-Type: application/json; charset=utf-8" \
   -d $'{"rating" : 3}'

# for testing sort purposes, update seller ratings
read -p $'\nUpdate seller rating'
curl -X "PUT" "http://localhost:3000/rating/1" \
   -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
   -H "Content-Type: application/json; charset=utf-8" \
   -d $'{"rating" : 5}'

read -p $'\nUpdate seller rating'
curl -X "PUT" "http://localhost:3000/rating/3" \
   -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
   -H "Content-Type: application/json; charset=utf-8" \
   -d $'{"rating" : 2}'

read -p $'\nUpdate seller rating'
curl -X "PUT" "http://localhost:3000/rating/4" \
   -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
   -H "Content-Type: application/json; charset=utf-8" \
   -d $'{"rating" : 4}'

read -p $'\nMake Purchase'
curl -X "PUT" "http://localhost:3000/description/4" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
      -H "Content-Type: application/json; charset=utf-8" \
      -d $'{"postID": 3}'

read -p $'\nGet users n Purchase history'
curl  "http://localhost:3000/users/4/private" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQ
   iOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es"

      
read -p$'\nPromote user'
curl -X "PUT" "http://localhost:3000/users/1/admin" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
   -H "Content-Type: application/json; charset=utf-8" \
   -d $'{"userID":3}'


read -p $'\nGet post details'
curl "http://localhost:3000/post/1" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es"

read -p $'\nGet post details'
curl "http://localhost:3000/post/1" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es"

read -p $'\nGet post details'
curl "http://localhost:3000/post/3" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es"

read -p $'\nMost viewed'
curl "http://localhost:3000/top"

read -p $'\nToronto City'
curl "http://localhost:3000/city/toronto"

read -p $'\nMississauga City'
curl "http://localhost:3000/city/mississauga"

read -p $'\nScarborough City'
curl "http://localhost:3000/city/scarborough"

read -p $'\nDelete user'
curl -X "DELETE" "http://localhost:3000/users/2" \
     -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOjEsImV4cCI6MTU1MTc1ODg4MjEzMX0.u80jNQx75Q3bT0kvwwhuynRWO9-EqOVKyEjGSRom4es" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{}'
