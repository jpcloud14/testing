public with sharing class ReadinessProgramController {
    
    @AuraEnabled(cacheable=true)
    public static List<Youth_Goal__c> getGoalRecords(){
        return [SELECT Id,Priority__c,Domain_Name__c,Domain_Name__r.name FROM Youth_Goal__c WHERE Program_Phase__c = 'READINESS' ];
    }
}