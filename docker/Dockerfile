FROM node:8.3.0

MAINTAINER Austin Ray Smitherman

#install global tool
RUN npm install -g ionic@3.12.0 --save
RUN npm install -g cordova@7.0.1 --save

#Update, upgrade, and install
RUN apt-get update
RUN apt-get install xdg-utils -y

#Create directory for JamQ project
RUN mkdir JamQ

#Assign JamQ as new directory
WORKDIR JamQ

#install node dependancies for project in package.json
RUN npm install

#make the directory for Ionic config and logs
RUN mkdir /root/.ionic

#Start the Ionic Development server
CMD ionic serve --lab 
