FROM node:argon

#Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Install app dependencies
COPY package.json /usr/src/app/

#Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]
