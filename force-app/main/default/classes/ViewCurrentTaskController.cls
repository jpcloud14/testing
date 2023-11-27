public with sharing class ViewCurrentTaskController {
    
    @AuraEnabled(cacheable=true)
    public static List<Task> viewCurrentTask(){
        return [SELECT Id,Subject,Status,ActivityDate FROM Task];
    }
}