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

import * as Com from "./Common";

class Lock {

    public expiringAt: number;

    public token: string;

    public constructor(
        token: string,
        expiringAt: number
    ) {

        this.expiringAt = expiringAt;

        this.token = token;
    }

    public isExpired(): boolean {

        return this.expiringAt !== 0 && this.expiringAt < Date.now();
    }
}

class IntraprocessDriver
implements Com.IDriver {

    private _locks: Record<string, Lock>;

    public constructor() {

        this._locks = {};
    }

    public lock(
        key: string,
        token: string,
        expiringAt: number
    ): boolean {

        let lock = this._locks[key];

        if (lock && !lock.isExpired()) {

            return false;
        }

        this._locks[key] = new Lock(token, expiringAt);

        return true;
    }

    public unlock(
        key: string,
        token: string
    ): boolean {

        let lock = this._locks[key];

        if (lock) {

            if (lock.token === token) {

                delete this._locks[key];
                return true;
            }
            else if (lock.isExpired()) {

                delete this._locks[key];
            }
        }

        return false;
    }

    public checkLocked(
        key: string,
        token: string
    ): boolean {

        let lock = this._locks[key];

        if (lock) {

            if (lock.isExpired()) {

                delete this._locks[key];

                return false;
            }

            if (lock.token === token) {

                return true;
            }
        }

        return false;
    }
}

/**
 * Create a driver for intraprocess usage.
 */
export function createIntraprocessDriver(): Com.IDriver {

    return new IntraprocessDriver();
}
