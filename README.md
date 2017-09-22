# JamQ
An app that lets your guests create your music playlist.


## Setting up Docker container
First step, make sure you download and install [Docker](https://docs.docker.com/engine/installation/). 
Check your install with the Command:
```bash
docker --version
```

## 2 Methods for developing with the JamQ docker container
### First Method (recomended)
Run docker with localy cloned directory mounted in the container
* The container will have all tools regardless of host OS
* Any changes to the git directory will reflect in local host directory

Run JamQ container (this will install image if not found locally)
Use the absolute path of your github repository of your machine
```bash
sudo docker run -i --name JamQ -v <Path-To-JamQ-Dir>:/JamQ -d -p 8100:8100 asmitherman/jamq
```
EXAMPLE:
```bash
sudo docker run -i --name JamQ -v /Users/asmitherman/Projects/JamQ:/JamQ -d -p 8100:8100 asmitherman/jamq
```
This command will install and run docker image from asmitherman/jamq repository on docker cloud. 
 * -i   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       Runs container in interactive mode 
 * --name    &nbsp;&nbsp;&nbsp;  Will name container JamQ for easy reference
 * -v    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;   Will use local directory volume and mount it to /JamQ of container
 * -d      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;   Will run JamQ container in the background
 * -p      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;  Will secify port number, opens ionic serve through 8100

Now we can execute the shell for running the development server for ionic 
```bash
sudo docker exec -it JamQ /bin/bash
```
* This will open the interactive shell for our container 

From here run:
```bash
ionic serve --lab
```
* This command will fail once, just run it again. 

Once the live reload development server is running we can reach it at [localhost:8100](http://localhost:8100/ionic-lab) on the host machine 

### Second Method (not recommended)
Run a docker container and git pull into the container 
* not recomended because each time the container is stopped it will delete the directory and work will be gone forever. 

Install and run
```bash
sudo docker run -i --name JamQ -d -p 8100:8100 asmitherman/jamq
```
Get into JamQ shell
```bash
sudo docker exec -it JamQ /bin/bash
```
Clone JamQ repository (not recommended)
```bash
git clone https://github.com/ChicoState/JamQ.git
```
From here run:
```bash
ionic serve --lab
```
* This command will fail once, just run it again. 

Once the live reload development server is running we can reach it at [localhost:8100](http://localhost:8100/ionic-lab) on the host machine 



## Known issues using JamQ docker container
* ionic serve will not open browser automatically
* livereload will build on change but not reflect in browser. Must refresh page after each build

## Built With
- [Ionic 3](https://ionicframework.com/) - The web framework used
- [Angular 4](https://angular.io/) 
- [NodeJS](https://nodejs.org/)
- [Cordova 7](https://cordova.apache.org/#getstarted) - Only for mobile builds
- [XCode 9](https://developer.apple.com/xcode/) - For iOS builds
- [Android Studio](https://developer.android.com/studio/install.html) - For Android builds
- [Docker](https://www.docker.com/) - Testing and development environment
