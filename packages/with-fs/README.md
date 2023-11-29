<br/>
<p align="center">
<a href=" " target="_blank">
<img src="./vite.svg" width="180" alt="Dataverse logo">
</a >
</p >
<br/>

# dapp-fs-example

## Overview

This example adds some commonly used file-system calls on top of the base. 
It demonstrates more process of handling file/folder and data-token/data-union by using Dataverse hooks.

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
