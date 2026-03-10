import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {interval, Observable, Subject, Subscription, take, takeUntil} from 'rxjs';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class PaymentCheckService {
    private pollingInterval = 5000; // 5 seconds
    private pollingDuration = 120000; // 2 minutes in milliseconds
    private polling$: Subscription;
    private pollingDataSubject = new Subject<any>();
    private stopPolling = new Subject<void>();

    constructor(private http: HttpClient,private router:Router) {
    }

    startPolling(transaction_id: any): void {
        this.polling$ = interval(this.pollingInterval)
            .pipe(
                takeUntil(this.stopPolling),
                take(this.pollingDuration / this.pollingInterval)
            )
            .subscribe(() => {
                this.http.get(environment.base_url + "/check-payment-status/" + transaction_id).subscribe(
                    (response: any) => {
                        console.log('res',response);
                        this.pollingDataSubject.next(response); // Send the response data to the calling component
                        if (response.curr_status.toLowerCase() != 'initiated') {
                            console.log('in case ')
                            this.stopPollingAndCleanUp();
                        }
                    },
                    (error) => {
                        console.error('Error in API call:', error);
                    }
                );
            });
    }

    stopPollingAndCleanUp(): void {
        console.log('stopped');
        this.stopPolling.next();
        this.stopPolling.complete();
        if (this.polling$) {
            this.polling$.unsubscribe();
        }
        // this.pollingDataSubject.complete();
        // this.router.navigateByUrl('/dashboard/deposit');
    }

    getPollingData(): Observable<any> {
        return this.pollingDataSubject.asObservable();
    }

    // startPeriodicCalls(transaction_id: any): any {
    //     let counter = 0;
    //     this.intervalSubscription = interval(5000).subscribe(() => {
    //         if (counter < 24) { // 24 intervals * 5 seconds = 2 minutes
    //             this.http.get(environment.base_url + "/check-payment-status/" + transaction_id).subscribe(
    //                 (response: any) => {
    //                     // Process the response as needed
    //                     console.log('Received response:', response);
    //                     if (response.curr_status.toLowerCase() != 'initiated') {
    //                         this.intervalSubscription.unsubscribe();
    //                     }
    //                     return response.curr_status;
    //                 },
    //                 (error) => {
    //                     console.error('Error:', error);
    //                 }
    //             );
    //             counter++;
    //         } else {
    //             if (this.intervalSubscription) {
    //                 this.intervalSubscription.unsubscribe();
    //             } // Stop the interval after 2 minutes
    //         }
    //     });
    // }

    // stopPeriodicCalls(): void {
    //     if (this.intervalSubscription) {
    //         this.intervalSubscription.unsubscribe();
    //     }
    // }
}
