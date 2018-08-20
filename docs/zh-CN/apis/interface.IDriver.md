# 接口 IDriver

该接口描述一个驱动对象的基本方法。

```ts
interface IDriver {

    /**
     * 尝试锁定一个互斥量。
     *
     * @param key           互斥量的唯一名称。
     * @param token         互斥量的锁定状态标识，用于确认是由哪个对象锁定的。
     * @param expiringAt    互斥量的锁定有效时长。设置为 0 则永不过期。
     *                      这是一个毫秒时间戳。
     */
    lock(
        key: string,
        token: string,
        expiringAt: number
    ): Promise<boolean> | boolean;

    /**
     * 根据锁定标识解锁一个互斥量。
     *
     * @param key           互斥量的唯一名称。
     * @param token         互斥量的锁定状态标识，用于确认是由哪个对象锁定的。
     */
    unlock(key: string, token: string): Promise<boolean> | boolean;

    /**
     * 判断一个互斥量是否被（指定锁定标识的拥有者）锁定。
     *
     * @param key           互斥量的唯一名称。
     * @param token         互斥量的锁定状态标识，用于确认是由哪个对象锁定的。
     */
    checkLocked(key: string, token: string): Promise<boolean> | boolean;
}
```
