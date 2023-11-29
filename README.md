<br/>
<p align="center">
<a href=" " target="_blank">
<img src="./logo.svg" width="180" alt="Dataverse logo">
</a >
</p >
<br/>

# dapp-examples

## Overview

### 1.base

This is a basic example of a Dataverse dapp, which includes two models: `post`
and `profile` with locate in `./base/models`. It demonstrates the process of
creating, loading, monetizing, and unlocking a post by using Dataverse hooks.

### 2.with-fs

This example adds some commonly used file-system calls on top of the base. 
It demonstrates more process of handling file/folder and data-token/data-union by using Dataverse hooks.

### 3.with-rainbowkit

This example adds rainbowkit on top of the base. 

### 4.social-network

This example shows how to build a basic Dataverse dapp of social-network. 
It demonstrates actions like posting, commenting, liking, etc.

## Run

### 1.Prepare

Before running example, you need to install `create-dataverse-app`.

```
pnpm install -g create-dataverse-app
```

Here we use `base` as an example.

```
cd base
```

### 2.Install

```
pnpm install
```

### 3.Deploy

```
dataverseos deploy
```

This step will need your private key to generate personal signature. Rest
assured, Dataverse will not store or disclose your private key..

After successful deployment, you can find the generated `./output/app.json`,
which contains various information about this new dapp.

### 4.Start

```
pnpm dev
```

The demo has been successfully launched. Try it!
