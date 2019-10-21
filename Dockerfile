FROM ubuntu:latest
RUN apt update && apt -y upgrade

#-----------------------------------------------
# NodeJs Websocket App
#-----------------------------------------------
RUN apt install -y libssl1.0-dev nodejs-dev node-gyp npm node-typescript
RUN npm install forever -g
RUN mkdir '/socket'
WORKDIR /socket
COPY . /socket
RUN npm install
RUN tsc

# todo run app with forever!
