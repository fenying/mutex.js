# 接口 IFactory

该接口描述一个工厂对象的基本方法。

```ts
interface IFactory {

    /**
     * 将一个驱动对象注册为一种互斥量类型。
     *
     * @param name      类型名称
     * @param driver    驱动对象
     */
    registerType(
        name: string,
        driver: IDriver
    ): this;

    /**
     * 列出所有可用的互斥量类型名称。
     */
    listTypes(): string[];

    /**
     * 创建一个指定类型的互斥量对象。
     *
     * @param type  互斥量类型
     * @param key   互斥量的唯一标识符
     * @param ttl   互斥量的锁定有效时长。设置为 0 则永不过期。默认值：0 （毫秒）
     */
    createMutex(
        type: string,
        key: string,
        ttl?: number
    ): IMutex;
}
```
