import { LightningElement,api } from 'lwc';
import mygoalpic from '@salesforce/resourceUrl/GoalPic';
import mycareerpic from '@salesforce/resourceUrl/Career';
import mycorepic from '@salesforce/resourceUrl/Core';
import myreadinesspic from '@salesforce/resourceUrl/Readiness';
import myAccountIcon from '@salesforce/resourceUrl/AccountIcon';
import myMTWLogo from '@salesforce/resourceUrl/MTWLogo';
import { NavigationMixin } from 'lightning/navigation';
export default class MTWHomepage extends NavigationMixin(LightningElement){

    @api contentId = "MCTSUK4DPJMFEYLEBPHU2SRUVRNI";
    imageForGoals = mygoalpic;
    imageForCareer = mycareerpic;
    imageForCore = mycorepic;
    imageForReadiness = myreadinesspic;
    imageForAccountIcon = myAccountIcon;
    imageForMtwLogo = myMTWLogo;

    
    redirectReadinessPage(){
        this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'ReadinessGoal__c'
            },
        });
    }

    redirectViewAllGoals(){
        this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'SeeAllGoals__c'
            },
        });
    }

    redirectUnderProcess(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Under_Construction__c'
                },
            });
    }

    viewCurrentTasks(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Update_Goal__c'
                },
            });
    }

}