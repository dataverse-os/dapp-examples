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

This is a basic example of a Dataverse dapp, which includes two models: `post` and `profile` with locate in `./base/models`. It demonstrates the process of creating, loading, monetizing, and unlocking a post by using Dataverse hooks.

### 2.with-toolkits

This example adds some commonly used [dweb-toolkit](https://github.com/dataverse-os/dweb-toolkits) on top of the base. In this example, the models will be diverse and varied.

In this example, each toolkit has its own models. In addition to the "post" and "profile" models in the base, you can find different toolkit models in the `./with-toolkits/models/toolkits` folder.

## Run

### 1.Prepare

Before running example, you need to install `dataverseos-cmd`.

```
pnpm install -g dataverseos-cmd
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

This step will need your private key to generate personal signature. Rest assured, Dataverse will not store or disclose your private key..

After successful deployment, you can find the generated `./output/app.json`, which contains various information about this new dapp.

### 4.Start

```
pnpm dev
```

The demo has been successfully launched. Try it!
