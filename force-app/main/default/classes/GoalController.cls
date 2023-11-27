public with sharing class GoalController {

    @AuraEnabled(cacheable=true)
    public static List<Task> getTaskRecords(String currentUserId, String whatId){
        if(whatId != null)
            return [SELECT Id,Subject,Status,ActivityDate,OwnerId,Owner.Name FROM Task WHERE OwnerId =: currentUserId AND whatId=:whatId order by createdDate asc];
        else
            return [SELECT Id,Subject,Status,ActivityDate,OwnerId,Owner.Name FROM Task WHERE OwnerId =: currentUserId order by createdDate asc];
    }

    @AuraEnabled
    public static void SaveNewTask(Task obj){
        try{
            insert obj;
        }catch(exception e){
            String errorMsg = e.getMessage();
            throw new AuraHandledException(ErrorMsg);
        }
    }

    @AuraEnabled
    public static void updateTaskStatus(Task updateStatusObj){
        try{
            update updateStatusObj;
        }catch(exception e){
            String errorMsg = e.getMessage();
            throw new AuraHandledException(ErrorMsg);
        }
    }

    @AuraEnabled
    public static void updateGoalPriority(Youth_Goal__c goalObject){
        try{
            update goalObject;
        }catch(exception e){
            String errorMsg = e.getMessage();
            throw new AuraHandledException(ErrorMsg);
        }
    }
}