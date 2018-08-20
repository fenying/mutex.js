/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

export interface IDriver {

    /**
     * Try locking up a mutex.
     *
     * @param key           The key of mutex to be locked.
     * @param token         The lock-token of mutex.
     * @param expiringAt    The expiring-time of mutex. It never expires if
     *                      set to 0. Default: 0 (ms)
     */
    lock(
        key: string,
        token: string,
        expiringAt: number
    ): Promise<boolean> | boolean;

    /**
     * Unlock a mutex.
     *
     * @param key       The key of mutex to be unlocked.
     * @param token     The lock-token of mutex.
     */
    unlock(key: string, token: string): Promise<boolean> | boolean;

    /**
     * Check if a mutex is locked.
     *
     * @param key       The key of mutex to be checked.
     * @param token     The lock-token of mutex.
     */
    checkLocked(key: string, token: string): Promise<boolean> | boolean;
}

export interface IFactory {

    /**
     * Register a new mutex type with a driver.
     *
     * @param name      Name of the mutex type.
     * @param driver    The lock driver for the type.
     */
    registerType(
        name: string,
        driver: IDriver
    ): this;

    /**
     * Get the names list of registerred types.
     */
    listTypes(): string[];

    /**
     * Create a mutex object.
     *
     * @param type  The type of mutex to be created.
     * @param key   The key of mutex to be created.
     * @param ttl   The lifetime of mutex. It never expires if set to 0.
     *              Default: 0 (ms)
     */
    createMutex(
        type: string,
        key: string,
        ttl?: number
    ): IMutex;
}

export interface IMutex {

    /**
     * The key of the mutex.
     */
    readonly key: string;

    /**
     * The lifetime of the lock of the mutex.
     *
     * Return 0 if never expiring.
     */
    readonly ttl: number;

    /**
     * The locked time of the mutex.
     *
     * Return 0 if not lcked.
     */
    readonly lockedAt: number;

    /**
     * The expiring time of the lock of the mutex.
     *
     * Return 0 if never expiring.
     */
    readonly expiringAt: number;

    /**
     * Check if the mutex is locked.
     */
    isLocked(): boolean;

    /**
     * Check if the lock of mutex is expired.
     */
    isExpired(): boolean;

    /**
     * Recheck if the mutex is locked by this object.
     *
     * If the mutex is not locked, return false directly.
     */
    recheckLocked(): Promise<boolean> | boolean;

    /**
     * Try locking up a mutex. This is a non-blocking method. It would return
     * immediately if the mutex is locked by others.
     *
     * Return false if this mutex is already locked (by anyone).
     *
     * @param ttl   The lifetime of mutex. It never expires if set to 0.
     *              Default: 0 (ms)
     */
    lock(ttl?: number): Promise<boolean> | boolean;

    /**
     * Unlock a locked mutex.
     *
     * If the mutex is not locked, return false directly.
     */
    unlock(): Promise<boolean> | boolean;
}
