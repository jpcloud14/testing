import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class UnderConstruction extends NavigationMixin(LightningElement) {

    redirectReadinessPage(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Goals__c'
                },
            });
    }
}