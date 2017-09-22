FROM node:8.3.0

MAINTAINER Austin Ray Smitherman

#Open port 8100 for development server
# EXPOSE 8100

#Add Project directory of JamQ to Container
#VOLUME .

#install global tool
RUN npm install -g ionic@3.12.0 --save
RUN npm install -g cordova@7.0.1 --save


#Update, upgrade, and install
RUN apt-get update
RUN apt-get install xdg-utils
#Create directory for JamQ project
RUN mkdir JamQ

#Assign JamQ as new directory
WORKDIR JamQ

#install node dependancies for project in package.json
RUN npm install
RUN ionic serve --lab
