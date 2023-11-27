public with sharing class BatchClass2 implements Database.Batchable<sObject> ,Database.Stateful
{
    public set<String> FirstName=new set<String>();
    public set<String> Phone=new set<String>();
    public map<String,contact> mapOfMaster=new Map<String,Contact>();
    public BatchClass2(set<String> FirstName,set<String> Phone) 
    {
        this.FirstName=FirstName;
        this.Phone=Phone;
        System.debug('FirstName Set=='+this.FirstName);
        System.debug('Phone=='+this.Phone);
    }
    public Database.QueryLocator start(Database.BatchableContext bc)
    {
        System.debug('In Start Method');
        return Database.getQueryLocator([Select ID,FirstName,LastName,Phone,Email from Contact ]);//where FirstName =:FirstName And Phone=:Phone]);
    } 
    public void Execute(Database.BatchableContext bc,List<contact> recList)
    {
        System.debug('REcord List when Come In Execute Method=='+recList);
        map<String,List<contact>> mapObj=new Map<String,List<Contact>>();
        for(Contact con:recList)
        {
            if(!mapOfMaster.containsKey(con.FirstName+con.Phone))
            {
                mapOfMaster.put(con.FirstName+con.Phone,con);
            }
            else if(mapObj.containsKey(con.FirstName+con.Phone))
            {
                List<Contact> conList=mapObj.get(con.FirstName+con.Phone);
                conList.add(con);
                mapObj.put(con.FirstName+con.Phone,conList);
            }
            else 
            {
                List<Contact> tempList=new List<Contact>();
                tempList.add(con);
                mapObj.put(con.FirstName+con.Phone,tempList);
            }
        }
        for(String str:mapObj.keyset())
        {
            Contact con=new contact();
            con=mapOfMaster.get(str);
            List<Contact> recList2=mapObj.get(str);
            System.debug('RecList befor add Master Record Size=='+recList2.size());
            recList2.add(0,con);
            System.debug('RecList befor add Master Record Size=='+recList2.size());
            if(recList2.size()>1)
            {
                integer size=recList2.Size()/2;
                System.debug('Size=='+size);
                for(integer i=1; i<=size;i++)
                {
                    System.debug('i value==='+i);
                    List<Contact> conList=new List<Contact>();
                    for(Integer j=1;j<=2;j++)
                    {
                        System.debug('REcord List Size Outside the If Which Check Last Record'+recList2.size());
                        if(recList2.size()>1)
                        {
                            System.debug('REcord List Before Remove Element'+recList2.get(1));
                            Contact con1=new contact();
                            con1.ID=recList2.get(1).ID;
                            conList.add(con1);
                            recList2.remove(1);
                        }
                    }
                    System.debug('Master=='+con);
                    System.debug('Student List=='+conList);
                    Database.merge(con,conList,false);            
                }
            }

        }
    } 
    public void finish(Database.BatchableContext bc)
    {
       /* //List<Contact>ConList=[Select ID,FirstName,LastName,Phone,Email from Contact where FirstName =:FirstName And Phone=:Phone];
        
        AsyncApexJob a = [Select Id, Status,ExtendedStatus,NumberOfErrors, JobItemsProcessed,
        TotalJobItems, CreatedBy.Email
        from AsyncApexJob where Id =:BC.getJobId()];
        
        // Send an email to the Apex job's submitter notifying of job completion.  
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {a.CreatedBy.Email};
        mail.setToAddresses(toAddresses);
        mail.setSubject('Merging Recodrd  ' + a.Status);
        mail.setPlainTextBody('The batch Apex job processed ' +a.JobItemsProcessed+
       ' batches with '+ a.NumberOfErrors + ' failures.');
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });  */

        System.debug('WE are in Finish Method');
    } 

}