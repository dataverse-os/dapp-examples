<br/>
<p align="center">
<a href=" " target="_blank">
<img src="./vite.svg" width="180" alt="Dataverse logo">
</a >
</p >
<br/>

# dapp-social-network

## Overview

This example shows how to build a basic Dataverse dapp of social-network. 
It demonstrates actions like posting, commenting, liking, etc.

## Run

### 1.Prepare

Before running example, you need to install `create-dataverse-app`.

```
pnpm install -g create-dataverse-app
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
