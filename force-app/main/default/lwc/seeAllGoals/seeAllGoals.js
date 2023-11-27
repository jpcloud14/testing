import { LightningElement } from 'lwc';
import myEmployment from '@salesforce/resourceUrl/Employment';
import myFINANCES from '@salesforce/resourceUrl/FINANCES';
import myEDUCATION from '@salesforce/resourceUrl/EDUCATION';
import myDCF from '@salesforce/resourceUrl/DCF';
import myHousing from '@salesforce/resourceUrl/HOUSING';
import myHealth from '@salesforce/resourceUrl/HEALTH';
import mySupport from '@salesforce/resourceUrl/SUPPORT';
import myParenting from '@salesforce/resourceUrl/PARENTING';
export default class ReadinessProgramPage extends LightningElement {

    imageForEmployment= myEmployment;
    imageForFinance= myFINANCES;
    imageForEducation= myEDUCATION;
    imageForDCF= myDCF;
    imageForHousing= myHousing;

    imageForHealth= myHealth;
    imageForSupport= mySupport;
    imageForParenting= myParenting;

}