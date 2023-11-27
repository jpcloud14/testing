import { LightningElement,wire,track } from 'lwc';
import myEmployment from '@salesforce/resourceUrl/Employment';
import myFINANCES from '@salesforce/resourceUrl/FINANCES';
import myEDUCATION from '@salesforce/resourceUrl/EDUCATION';
import myDCF from '@salesforce/resourceUrl/DCF';
import myHousing from '@salesforce/resourceUrl/HOUSING';
import myHealth from '@salesforce/resourceUrl/HEALTH';
import mySupport from '@salesforce/resourceUrl/SUPPORT';
import myParenting from '@salesforce/resourceUrl/PARENTING';
import getGoalRecords from '@salesforce/apex/ReadinessProgramController.getGoalRecords';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

export default class ReadinessProgramPage extends NavigationMixin(LightningElement) {

    priorityValue = 'Low';

    imageForEmployment= myEmployment;
    imageForFinance= myFINANCES;
    imageForEducation= myEDUCATION;
    imageForDCF= myDCF;
    imageForHousing= myHousing;

    imageForHealth= myHealth;
    imageForSupport= mySupport;
    imageForParenting= myParenting;
    wiredGoalList;
    @track employmentPriority;
    @track housingPriority;
    @track financePriority;
    @track healthPriority;
    @track educationPriority;
    @track supportPriority;
    @track dcfPriority;
    @track parentingPriority;


    connectedCallback(){
        console.log('test');
        refreshApex(this.wiredGoalList);
    }

    @wire(getGoalRecords)
    GoalRecords(result2){
        if(result2.data){
            console.log('test2');
            this.wiredGoalList = result2;
            
            console.log('result2.data->',JSON.stringify(result2.data));
            result2.data.forEach(result=>{
                if(result.Domain_Name__c == 'a1WDn000000eAX6MAM'){
                    this.employmentPriority = result.Priority__c;
                }else if(result.Domain_Name__c == 'a1WDn000000eAXBMA2'){
                    this.housingPriority = result.Priority__c;
                }
                else if(result.Domain_Name__c == 'a1WDn000000eAXHMA2'){
                    this.financePriority = result.Priority__c;
                }
                else if(result.Domain_Name__c == 'a1WDn000000eAXLMA2'){
                    this.healthPriority = result.Priority__c;
                }
                else if(result.Domain_Name__c == 'a1WDn000000eAXGMA2'){
                    this.educationPriority = result.Priority__c;
                }
                else if(result.Domain_Name__c == 'a1WDn000000eAXCMA2'){
                    this.supportPriority = result.Priority__c;
                }
                else if(result.Domain_Name__c == 'a1WDn000000eAXQMA2'){
                    this.dcfPriority = result.Priority__c;
                }
                else if(result.Domain_Name__c == 'a1WDn000000eAX7MAM'){
                    this.parentingPriority = result.Priority__c;
                }

            })
            console.log('employment->',JSON.stringify(this.employmentPriority));
        }else if(result2.error){
            console.log('error->',JSON.stringify(result2.error));
        }
        
    };

    hanldePrirorityValueChange(event){
        this.priorityValue = event.detail.priority;
        this.showReadinessComponent = event.detail.show;
        this.showChildComponent = event.detail.showGoal
    }

    openUpdateGoalComponent(event){
        console.log('datavalue->',event.target.dataset.value);
        console.log('id->',event.target.id);
        refreshApex(this.GoalRecords);
        let id = event.target.id;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Update_Goal__c'
                },
            state: {
                selectedRecordId: id,
                priority: event.target.dataset.value
            }
        });
    }

}