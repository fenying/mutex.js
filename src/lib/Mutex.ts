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

export class Mutex
implements Com.IMutex {

    private _driver: Com.IDriver;

    private _ttl: number;

    private _key: string;

    private _lockedAt: number;

    private _expiringAt: number;

    public constructor(
        driver: Com.IDriver,
        key: string,
        ttl: number = 0
    ) {
        this._driver = driver;

        this._key = key;
        this._ttl = ttl;

        this._lockedAt = 0;
        this._expiringAt = 0;
    }

    public get key(): string {

        return this._key;
    }

    public get ttl(): number {

        return this._ttl;
    }

    public get lockedAt(): number {

        return this._lockedAt;
    }

    public get expiringAt(): number {

        return this._expiringAt;
    }

    public isLocked(): boolean {

        return this._lockedAt > 0;
    }

    public isExpired(): boolean {

        return this._expiringAt !== 0 && this._expiringAt < Date.now();
    }

    public lock(ttl: number = 0): Promise<boolean> | boolean {

        if (this._lockedAt) {

            if (this.isExpired()) {

                this._lockedAt = 0;
                this._expiringAt = 0;
            }
            else {

                return false;
            }
        }

        this._lockedAt = Date.now();

        if (ttl || this._ttl) {

            this._expiringAt = this._lockedAt + (ttl || this._ttl);
        }
        else {

            this._expiringAt = 0;
        }

        const result = this._driver.lock(
            this._key,
            this._lockedAt,
            this._expiringAt
        );

        if (typeof result === "boolean") {

            if (!result) {

                this._lockedAt = 0;
                this._expiringAt = 0;
            }

            return result;
        }

        result.then((realResult) => {

            if (!realResult) {

                this._lockedAt = 0;
                this._expiringAt = 0;
            }
        });

        return result;
    }

    public unlock(): Promise<boolean> | boolean {

        if (!this._lockedAt) {

            return false;
        }

        if (this.isExpired()) {

            this._lockedAt = 0;
            this._expiringAt = 0;

            return true;
        }

        const result = this._driver.unlock(this._key, this._lockedAt);

        if (typeof result === "boolean") {

            if (result) {

                this._lockedAt = 0;
                this._expiringAt = 0;
            }

            return result;
        }

        result.then((aResult) => {

            if (aResult) {

                this._lockedAt = 0;
                this._expiringAt = 0;
            }
        });

        return result;
    }

    public recheckLocked(): Promise<boolean> | boolean {

        if (!this._lockedAt) {

            return false;
        }

        if (this.isExpired()) {

            this._lockedAt = 0;
            this._expiringAt = 0;

            return false;
        }

        const result = this._driver.checkLocked(this._key, this._lockedAt);

        if (typeof result === "boolean") {

            if (!result) {

                this._lockedAt = 0;
                this._expiringAt = 0;
            }

            return result;
        }

        result.then((aResult) => {

            if (!aResult) {

                this._lockedAt = 0;
                this._expiringAt = 0;
            }
        });

        return result;
    }
}

export default Mutex;
