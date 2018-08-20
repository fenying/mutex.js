# 接口 IMutex

该接口描述一个互斥量对象的基本操作接口。

每个互斥量通过一个 key 进行标识。而一个互斥量对象是对特定一个互斥量的控制器。多个对象
可以通过同一个 key 对同一个互斥量进行控制。彼此之间的控制相互排斥。

```ts
interface IMutex {

    /**
     * 获取当前对象互斥量的唯一名称。
     */
    readonly key: string;

    /**
     * 当前对象对该互斥量的每次锁定有效时长，单位：毫秒。
     *
     * 0 表示永久有效。
     */
    readonly ttl: number;

    /**
     * 当前对象对该互斥量的锁定时间，这是一个毫秒时间戳。
     *
     * 0 表示未锁定。
     */
    readonly lockedAt: number;

    /**
     * 该互斥量的锁定状态过期时间，到这个时间则该互斥量的锁定状态自动解除。
     *
     * 这是一个毫秒时间戳。
     *
     * 0 表示未永不过期。
     */
    readonly expiringAt: number;

    /**
     * 检查当前对象是否成功锁定了该互斥量。
     */
    isLocked(): boolean;

    /**
     * 检查当前对象对该互斥量的锁定状态是否已经过期。
     */
    isExpired(): boolean;

    /**
     * 重新检查当前对象对该互斥量的锁定状态。
     */
    recheckLocked(): Promise<boolean> | boolean;

    /**
     * 尝试锁定该互斥量。该接口是非阻塞的，一旦失败立即返回，而不是等待其他会话、进程
     * 释放锁。
     *
     * 如果该互斥量此前已经被当前对象锁定了，则也会返回 false。
     *
     * @param ttl   锁定状态的有效时长，该参数可以覆盖该互斥量对象的设置。如果设置为
     *              0 则互斥量的锁定状态永不过期。
     *              默认值：0 （毫秒）
     */
    lock(ttl?: number): Promise<boolean> | boolean;

    /**
     * 解除当前对象对该互斥量的锁定。
     *
     * 如果该互斥量不是被当前对象锁定的，则无法解除锁定，返回 false。
     */
    unlock(): Promise<boolean> | boolean;
}

```