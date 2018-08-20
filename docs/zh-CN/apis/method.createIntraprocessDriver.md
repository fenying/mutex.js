# 模块方法 createIntraprocessDriver

该方法用于创建一个进程内（`Intraprocess`）的互斥量驱动对象。

> 每个 `Intraprocess` 对象彼此独立隔离，即不同的 `Intraprocess` 对象之间，可以有
> 同名的互斥量，且互不干扰。

```ts
function createIntraprocessDriver(): IDriver;
```
