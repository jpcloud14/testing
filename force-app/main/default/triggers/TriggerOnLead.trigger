trigger TriggerOnLead on Lead (after insert,after update) {
    if(Trigger.isAfter && Trigger.isInsert){
    	LeadTriggerHelper.afterInsert(Trigger.New);    
    }
    
    if(Trigger.isAfter && Trigger.isUpdate){
     LeadTriggerHelper.afterUpdate(Trigger.New,Trigger.oldMap);   
    }
}