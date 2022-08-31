# Sqlana ⚡️

## Introduction

Let's say you wrote a solana program using anchor, now you want to build a dapp, you have two options either use an indexer and rely on your contract for data or have a database and api. Both approaches require a database schema~

## Introducing _Sqlana_ ⚡️

A transpiler for all our schemas.<br>
Anchor program IDL -> Prisma Schema △ <br>
Anchor program IDL -> SQL Schema 💿 <br>
Anchor program IDL -> Graphql Schema 🕸 <br>

Currently this works with Prisma Schema but we want to add support for more.

# Demo
[![Demo Video](https://github.com/anoushk1234/anchor-prisma-transpiler/blob/main/anchorprismademo.gif?raw=true)](https://www.loom.com/share/6f9e0f605618457bbf73884a3c66ba81)

# Quickstart

- `yarn install`
- Add the idl json file in idl.json
- `yarn setup` (only for first time otherwise yarn start)

Support this project on anoushk.sol or [wagmi.bio/anoushk](https://wagmi.bio/anoushk)
