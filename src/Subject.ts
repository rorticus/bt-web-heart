import {Observable} from "@dojo/core/Observable";
import {SubscriptionObserver} from "@dojo/shim/Observable";

export class Subject<T> extends Observable<T> {
    private _subscription: SubscriptionObserver<T>;

    constructor() {
        super(subscription => {
            this._subscription = subscription;
        });
    }

    next(value: T): any {
        return this._subscription.next(value);
    }

    error(errorValue: any): any {
        return this._subscription.error(errorValue);
    }

    complete(completeValue?: any): void {
        return this._subscription.complete(completeValue);
    }

    asObservable() {
        return Observable.from<T>(this);
    }
}

export default Subject;
