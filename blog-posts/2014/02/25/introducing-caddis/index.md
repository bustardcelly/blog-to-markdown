---
title: 'Caddis: The On-The-Fly JSON RESTful Server'
author:
  name: 'todd anderson'
date: '2014-02-18'
---
Recently I released a new node-based CLI tool called [caddis](https://github.com/bustardcelly/caddis). It allows you to start a server - as a daemon - on localhost and dynamically add routes and JSON responses. Once stopped, any work is wiped; it is purely in-memory, session based. 

The impetus for its creation was a requirement to easily mock service APIs to be called in a test environment without regards to libraries or languages in which the environment is run. 

To be more specific, for a recent project I am using the wonderful [calabash-ios](http://calaba.sh/) framework to define [cucumber](http://cukes.info/) specs in [Ruby](https://www.ruby-lang.org/en/) that drive automated integration tests for an __iOS__ project in the simulator. Creating [caddis](https://github.com/bustardcelly/caddis) allows me to easily mock service requests that the __iOS__ application will make and validate the expected result of scenarios in [cucumber](http://cukes.info/).

## Installation & Usage
[caddis](https://github.com/bustardcelly/caddis) is available through npm. It is recommended that you install globally:

```
$ npm install -g caddis
```

_&gt; you may need to `sudo`_

To use [caddis](https://github.com/bustardcelly/caddis) 

```
$ caddis start
$ curl -X POST -d '{"method":"GET", "uri":"/foo", "response":{"bar":"baz"}}' http://localhost:3001/api --header "Content-Type:application/json"
```

Visit [http://localhost:3001/foo](http://localhost:3001/foo), prints:

```
{
  bar: 'baz'
}
```

```
$ caddis stop
```

Visit [http://localhost:3001/foo](http://localhost:3001/foo), Not Found.

### Options

```
$ caddis -h

usage: caddis [action]

Starts a server at http://localhost:3001 as a daemon, exposing an api to post JSON to in order to mock a RESTful service.

actions:
  start               Start Caddis at http://localhost:3001
  stop                Stop a previously started Caddis daemon
options:
  -h                  Display this help menu
```

## What?

![Caddis Fly Lure](http://custardbelly.com/images/caddis.jpg)  
A caddis is a moth-like insect often used as models for fly lures in fishing.

The [caddis](https://github.com/bustardcelly/caddis) CLI tool is used to start and stop a RESTful JSON service with the ability to POST route configuration and responses, on-the-fly, for mocking and testing purposes.

_It may be a stretch, but there's wit in there somewhere..._

## Why?

There are other projects I have been a part of, such as [madmin](https://github.com/infrared5/madmin), that allow for dynamically creating RESTful APIs through a User Interface and allows for persistance through I/O.

Recently, I was involved with mocking a service layer for unit testing purposes and found that the manual curation of such an API was too tedious for the task at hand - I wanted the process to be much more fluid and simple.

In this particular instance I needed to:

1. Start a server in setup/before
2. Dynamically add a route to the service with mock JSON response
3. Run the test
4. Shut down the server in teardown/after

Fairly simple, and most of all I didnt want any artifacts lying around - in other words I didn't need for any routes that I dynamically created to stick around on my local disk after the tests were done.

As such, [caddis](https://github.com/bustardcelly/caddis) was born.

## How

As mentioned briefly above, [caddis](https://github.com/bustardcelly/caddis) is a CLI tool. It is recommended to install globally:

```
$ npm install -g caddis
```
_&gt; you may need to `sudo`_

Once installed, you can start the service (currently defaults to [http://localhost:3001](http://localhost:3001)) and begin POSTing route configurations in JSON. Here is an example using cUrl that dynamically adds a GET route at `/foo` with a simple JSON payload of `{"bar":"baz"}`:

```
$ curl -X POST -d '{"method":"GET", "uri":"/foo", "response":{"bar":"baz"}}' http://localhost:3001/api --header "Content-Type:application/json"
```

You are not confiuned to cUrl - you can use whatever networking library in whatever language you are writing your tests in and the server can handle all modern RESTful methods:

* GET
* POST
* PUT
* DELETE

When you are finished, simply stop the [caddis](https://github.com/bustardcelly/caddis) server:

```
$ caddis stop
```

## Conclusion
I hope this was a useful introduction to what [caddis](https://github.com/bustardcelly/caddis) has to offer and that you may find it beneficial in your testing in some way.

You can visit the project on github at: [https://github.com/bustardcelly/caddis](https://github.com/bustardcelly/caddis)