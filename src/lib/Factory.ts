/**
 *  Copyright 2020 Angus.Fenying <fenying@litert.org>
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

import * as Com from './Common';
import Mutex from './Mutex';

class Factory
implements Com.IFactory {

    private _types: Record<string, Com.IDriver>;

    public constructor() {

        this._types = {};
    }

    public registerType(name: string, driver: Com.IDriver): this {

        if (this._types[name]) {

            throw new Error(`Mutex type "${name}" was already registerred.`);
        }

        this._types[name] = driver;

        return this;
    }

    public listTypes(): string[] {

        return Object.keys(this._types);
    }

    public createMutex(
        type: string,
        key: string,
        ttl?: number
    ): Com.IMutex {

        if (!this._types[type]) {

            throw new Error(`Mutex type "${name}" doesn't exist.`);
        }

        return new Mutex(
            this._types[type],
            key,
            ttl
        );
    }
}

export function createFactory(): Com.IFactory {

    return new Factory();
}

const defaultFactory = createFactory();

export function getDefaultFactory(): Com.IFactory {

    return defaultFactory;
}
