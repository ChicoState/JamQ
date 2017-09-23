# Setting up JamQ Docker Environment

First step, make sure you download and install [Docker](https://docs.docker.com/engine/installation/). 
Check your install with the Command:
```bash
docker --version
```

### Running the container (recomended)
This will run the docker environment and use the local ionic project files 
* The container will have all tools regardless of host OS
* Any changes to the git directory will reflect in local host directory

Run JamQ container (this will install image if not found locally)
Use the absolute path of your github repository of your machine
```bash
sudo docker run -i --name JamQ -v <Path-To-JamQ-Dir>:/JamQ -p 8100:8100 -p 35729:35729 -p 53703:53703 asmitherman/jamq
```
EXAMPLE:
```bash
sudo docker run -i --name JamQ -v /Users/asmitherman/Projects/JamQ:/JamQ -p 8100:8100 -p 35729:35729 -p 53703:53703 asmitherman/jamq
```

This command will install and run docker image from asmitherman/jamq repository on docker cloud. 
 * -i   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       Runs container in interactive mode 
 * --name    &nbsp;&nbsp;&nbsp;  Will name container JamQ for easy reference
 * -v    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;   Will use local directory volume and mount it to /JamQ of container
 * -p      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;  Will secify port number, opens ionic serve through 8100, 35729, 53703

You will see the output from the development server running in live reload which will refresh whenever there is a change in the JamQ project directory. We can now reach it at [localhost:8100](http://localhost:8100/ionic-lab) on the host machine. 

## Known issues using JamQ docker container
* ionic serve will not open browser automatically
