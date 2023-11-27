import { LightningElement,wire } from 'lwc';
import viewCurrentTask from '@salesforce/apex/ViewCurrentTaskController.viewCurrentTask';
import { NavigationMixin } from 'lightning/navigation';

export default class ViewCurrentTasks extends NavigationMixin(LightningElement) {

    @wire(viewCurrentTask)
    wiredCurrentTask;

    redirectHomePage(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Goals__c'
            },
        });
    }

}