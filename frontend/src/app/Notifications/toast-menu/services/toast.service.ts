import {Injectable} from '@angular/core';
import {Toast} from "../interfaces/toaster.interface";
import {ToastType} from "../toaster.types";
import {BehaviorSubject, filter, Observable} from "rxjs";
import {StoredToast} from "../interfaces/StoredToast";

@Injectable({
    providedIn: 'root'
})
/**
 * Service to Control the Toast Behaviour
 */
export class ToastService {


    /**
     * Store Toast Body and read state
     */
    storedToasts: StoredToast[] = [];


    /**
     * Manage the changes of Toast Messages
     */
    _subject: BehaviorSubject<Toast | null>;
    /**
     * Detect Changes of Toast filter null values
     */
    readonly toast$: Observable<Toast>;


    /**
     * Manage and Updates the Toast Messages
     * Creates Observable Object from BehaviourSubject that passes Toast-Messages without null values
     */
    constructor() {
        this._subject = new BehaviorSubject<Toast | null>(null);
        this.toast$ = this._subject.asObservable()
            .pipe(filter(toast => toast !== null));
    }

    /**
     * Show Toasts for defined Seconds
     * @param type of shown Message
     * @param title defines header of Toast
     * @param body defines message of Toast
     * @param delay optional in Seconds to show Toast. Default seconds = 6
     * @param save optional value to save message body
     */

    show(type: ToastType, title: string, body: string, delay?: number, save?: boolean) {
        const delayInSeconds = delay ? delay * 1000 : undefined;
        this._subject.next({type, title, body, delay: delayInSeconds, save, read: false});
        if (save) {
            setTimeout(() => {
                this.storedToasts.push({body, read: false});
            }, delayInSeconds)
        }
    }

}
