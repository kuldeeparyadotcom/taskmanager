# taskmanager
taskmanager microservice expressjs mongoosejs REST api

Set up Instructions
Step 1:
Clone this repository

Step 2:
Navigate to app, build image and run container
cd taskmanager/taskmanager/
Execute buildImage.sh scrip to build Docker image.

Update host and port in spinupContainer.sh file.
For example:
sudo docker run -e "HOST=192.169.55.55" -e "MONGOPORT=27017" -name priority_manager -p 7012:3000 -d priority_taskmanager:0.1

If you have set up security in mongodb, you should pass credentials like this
sudo docker run -e "HOST=192.169.55.55" -e "MONGOPORT=27017" -e "USER=priority_admin" -e "PASSWORD=securepassword" -name priority_manager -p 7012:3000 -d priority_taskmanager:0.1

Of course, values to the following environment variables are dummy here. Replace with values in your environment.

Run Docker Container
Execute ./spinupContainer.sh


Side Note:
If you don't have mongo db already set up, you can run a container like this
docker run --name priority_mongo -p 27017:27017 -d mongo

(Make sure you pass right ip, port, [user, passoword] as environment variables when you run task manager container)
