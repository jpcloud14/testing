import { LightningElement,track,wire,api } from 'lwc';
import userId from '@salesforce/user/Id';
import getTaskRecords from '@salesforce/apex/GoalController.getTaskRecords';
import updateTaskStatus from '@salesforce/apex/GoalController.updateTaskStatus';
import updateGoalPriority from '@salesforce/apex/GoalController.updateGoalPriority';
import saveTask from '@salesforce/apex/GoalController.SaveNewTask';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';

export default class UpdateGoal extends NavigationMixin(LightningElement) {

    @track showSaveModal = false;
    @track currentUserId
    openUpdateStatusModal = false;
    @track priority;
    @track showLoading;
    @track updateID;
    @track defaultStatusValue = 'Not Started';
    @track updateOption;
    @track updateStatusValue = false;
    @track updatePriorityValue = false;
    @track recordId;
    warningCount = 0;
    objValues = {};
    statusOptions = [
        {label: '--None--', value: ''},
        {label: 'Not Started', value: 'Not Started'},
        {label: 'In Progress', value: 'In Progress'},
        {label: 'Completed', value: 'Completed'},
        {label: 'Waiting on someone else', value: 'Waiting on someone else'},
        {label: 'Deferred', value: 'Deferred'}
    ];

    priorityOptions = [
        {label: 'Low', value: 'Low'},
        {label: 'Normal', value: 'Normal'},
        {label: 'High', value: 'High'}
    ];

    connectedCallback(){
        refreshApex(this.wiredTaskRecords);
    }

    
    @wire(getTaskRecords,{currentUserId: userId})
    wiredTaskRecords;

    @wire(CurrentPageReference)
    getPageReferenceParameters(currentPageReference) {
       if (currentPageReference) {
          console.log(JSON.stringify(currentPageReference.state.selectedRecordId));
          console.log('state->',JSON.stringify(currentPageReference.state));
          if(currentPageReference.state.selectedRecordId != undefined){
          let id = currentPageReference.state.selectedRecordId;
          //if(id!='' || id != undefined){
            this.recordId = id.slice(0,18);
            this.priority = currentPageReference.state.priority;
          }
          console.log('recordId->',this.recordId);
          /*let attributes = currentPageReference.attributes;
          let states = currentPageReference.state;
          let type = currentPageReference.type;*/
       }
    }

    OpenTaskModal(){
        this.showSaveModal = true;
    }

    hideModalBox(){
        this.showSaveModal = false;
        this.openUpdateStatusModal = false;
    }

    async saveTask(event){
        if(event.target.name == 'Save'){
            this.showLoading = true;
            this.warningCount = 0;
            this.template.querySelectorAll('lightning-input,lightning-combobox').forEach(element => {
                console.log(element.reportValidity());
                if(element.reportValidity() == false){
                    this.warningCount++;
                }
            });
            if(this.warningCount == 0){
                this.template.querySelectorAll('lightning-input').forEach(rec=>{
                    if(rec.name == 'subject'){
                        this.objValues.Subject = rec.value;
                        console.log('subject->',rec.value);
                    }else if(rec.name == 'dueDate'){
                        this.objValues.ActivityDate = rec.value;
                        console.log('date->',rec.value);
                    }
                })

                this.objValues.Status = this.template.querySelector('lightning-combobox').value;
                this.objValues.WhoId = '003Dn00000WK3hDIAT';
                this.objValues.OwnerId = this.currentUserId;
                this.objValues.WhatId = this.recordId;

                console.log('objvalues->',JSON.stringify(this.objValues));

                saveTask({obj: this.objValues})
                .then(result=>{
                    this.showLoading = false;
                    refreshApex(this.wiredTaskRecords);
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Task created successfully.',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.showSaveModal = false;
                })
                .catch(error=>{
                    this.showLoading = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                })
            }else{
                this.showLoading = false;
            }
        }else if(event.target.name == 'Update'){
            if(this.updateOption == 'Update Status'){
                let updateObj = {
                    Id: this.updateID,
                    Status: this.template.querySelector('lightning-combobox').value
                }
                updateTaskStatus({updateStatusObj: updateObj})
                .then(result=>{
                    refreshApex(this.wiredTaskRecords);
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Status updated successfully.',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.openUpdateStatusModal = false;
                })
            }else if(this.updateOption == 'Update Priority'){
                this.priority = this.template.querySelector('lightning-combobox').value;
                let goalObj = {
                    Id: this.recordId,
                    Priority__c: this.priority
                }
                await updateGoalPriority({goalObject: goalObj})
                .then(result=>{
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Priority updated successfully.',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.openUpdateStatusModal = false;
                    notifyRecordUpdateAvailable([{recordId: this.recordId}]);
                })
                .catch(error=>{
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                })
            }
        }
    }

    updateTaskStatus(event){
        this.updateOption = 'Update Status';
        this.updateStatusValue = true;
        this.updatePriorityValue = false;
        this.defaultStatusValue = event.target.dataset.value;
        this.openUpdateStatusModal = true;
        let id = event.target.id;
        this.updateID = id.slice(0,18);
    }

    updatePriority(){
        this.updatePriorityValue = true;
        this.updateStatusValue = false;
        this.updateOption = 'Update Priority';
        this.openUpdateStatusModal = true;
    }

    redirectReadinessPage(){
        console.log('this.recordId=='+this.recordId);
        console.log('updatecall');
        this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'ReadinessGoal__c'
            },
        });
    }

}