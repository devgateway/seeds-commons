# seeds-commons

When configuring your new app / repo, you can select one directory that you want to configure to get content from a submodule.

For this guide, we'll use /src/seeds-commons

In this example, we'll be using two repos. One [seeds-dashboard](https://github.com/devgateway/seeds-dashboard.git) and one [seeds-commons](https://github.com/devgateway/seeds-commons.git)

## 1. Configure

### 1.1 Add a submodule

Configuring the submodule for the first time. Go to ui/src and run the command below on the command line:
```
git submodule add https://github.com/devgateway/seeds-commons.git seeds-commons
```
Remember that a react app should always store source code under src folder.

### 1.2 Fetch code after updating the seeds-dashboard app for the first time
you have to run the following git command on console in the directory ui/src/seeds-commons
```
git submodule update --init
```
### 1.3 Clone a fresh copy and fetch the submodules
you have to run the following git command on console in the directory ui/src/seeds-commons
```
git clone https://github.com/devgateway/seeds-dashboard.git --recursive
```
If you cloned the repository without --recursive you have to go then to step 1.2
